import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { useAppointments } from '@/contexts/AppointmentContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin,
  Phone,
  MessageSquare,
  Plus,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  const { appointments, getUpcomingAppointments, getPastAppointments, cancelAppointment } = useAppointments();

  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();
  
  console.log('Appointments page - All appointments:', appointments);
  console.log('Appointments page - Upcoming:', upcomingAppointments);
  console.log('Appointments page - Past:', pastAppointments);

  const handleBookNewAppointment = () => {
    navigate('/search');
  };

  const availableSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-secondary text-secondary-foreground';
      case 'completed': return 'bg-primary-soft text-primary';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      case 'pending': return 'bg-accent-soft text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
          <p className="text-muted-foreground">
            Manage your healthcare appointments
          </p>
        </div>
        <Button size="lg" onClick={handleBookNewAppointment}>
          <Plus className="w-4 h-4 mr-2" />
          Book New Appointment
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="book">Book New</TabsTrigger>
        </TabsList>

        {/* Upcoming Appointments */}
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/api/placeholder/40/40" />
                        <AvatarFallback>
                          {appointment.doctorName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                        <p className="text-primary font-medium">{appointment.specialty}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(appointment.status)}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {appointment.status}
                      </Badge>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => cancelAppointment(appointment.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <CalendarIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No upcoming appointments</h3>
                <p className="text-muted-foreground mb-4">
                  Book your next appointment to stay on top of your health
                </p>
                <Button onClick={handleBookNewAppointment}>
                  <Plus className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Past Appointments */}
        <TabsContent value="past" className="space-y-4">
          {pastAppointments.length > 0 ? (
            pastAppointments.map((appointment) => (
              <Card key={appointment.id} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/api/placeholder/40/40" />
                        <AvatarFallback>
                          {appointment.doctorName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                        <p className="text-primary font-medium">{appointment.specialty}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(appointment.status)}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {appointment.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                      <Button variant="default" size="sm">
                        Book Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <CalendarIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No past appointments</h3>
                <p className="text-muted-foreground">
                  Your appointment history will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Book New Appointment */}
        <TabsContent value="book" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border pointer-events-auto"
                />
              </CardContent>
            </Card>

            {/* Available Slots */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Available Times</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedDate?.toLocaleDateString() || 'Select a date'}
                </p>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-3">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant="outline"
                        className="justify-start h-12"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {slot}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-3" />
                    <p>Please select a date to view available times</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;