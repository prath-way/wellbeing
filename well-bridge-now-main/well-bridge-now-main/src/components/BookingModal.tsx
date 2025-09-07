import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, Star, CheckCircle, User, Phone, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  distance: string;
  availability: string;
  consultationFee: string;
  verified: boolean;
  languages: string[];
  experience: string;
  avatar: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onBookingSuccess: (appointment: any) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  doctor, 
  onBookingSuccess 
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    reason: '',
    notes: '',
    patientName: user?.user_metadata?.full_name || '',
    patientPhone: '',
    patientEmail: user?.email || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM'
  ];

  const appointmentReasons = [
    'General Consultation',
    'Follow-up Visit',
    'Routine Check-up',
    'Specific Symptoms',
    'Preventive Care',
    'Second Opinion',
    'Other'
  ];

  // Get available dates (next 14 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow

    while (dates.length < 14) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!doctor || !bookingData.date || !bookingData.time || !bookingData.reason) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const appointment = {
      id: Date.now(),
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: bookingData.date,
      time: bookingData.time,
      reason: bookingData.reason,
      notes: bookingData.notes,
      status: 'confirmed' as const,
      location: doctor.location,
      consultationFee: doctor.consultationFee,
      patientName: bookingData.patientName,
      patientPhone: bookingData.patientPhone,
      patientEmail: bookingData.patientEmail,
      createdAt: new Date().toISOString()
    };
    
    console.log('BookingModal - Created appointment:', appointment);

    onBookingSuccess(appointment);
    setStep(3); // Success step
    setIsSubmitting(false);
  };

  const resetModal = () => {
    setStep(1);
    setBookingData({
      date: '',
      time: '',
      reason: '',
      notes: '',
      patientName: user?.user_metadata?.full_name || '',
      patientPhone: '',
      patientEmail: user?.email || ''
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 3 ? 'Booking Confirmed!' : 'Book Appointment'}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            {/* Doctor Info */}
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <Avatar className="w-16 h-16">
                <AvatarImage src={doctor.avatar} alt={doctor.name} />
                <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{doctor.name}</h3>
                <p className="text-primary font-medium">{doctor.specialty}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-500" />
                    <span>{doctor.rating} ({doctor.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{doctor.location}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    {doctor.availability}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{doctor.consultationFee}</p>
                <p className="text-sm text-muted-foreground">Consultation</p>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <Label className="text-base font-semibold">Select Date</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {getAvailableDates().slice(0, 9).map((date) => (
                  <Button
                    key={date.toISOString()}
                    variant={bookingData.date === date.toISOString().split('T')[0] ? "default" : "outline"}
                    className="h-auto p-3 flex flex-col"
                    onClick={() => handleInputChange('date', date.toISOString().split('T')[0])}
                  >
                    <span className="text-xs text-muted-foreground">
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                    <span className="font-semibold">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {bookingData.date && (
              <div>
                <Label className="text-base font-semibold">Select Time</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={bookingData.time === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange('time', time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Reason Selection */}
            {bookingData.time && (
              <div>
                <Label className="text-base font-semibold">Reason for Visit</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {appointmentReasons.map((reason) => (
                    <Button
                      key={reason}
                      variant={bookingData.reason === reason ? "default" : "outline"}
                      size="sm"
                      className="justify-start"
                      onClick={() => handleInputChange('reason', reason)}
                    >
                      {reason}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {bookingData.reason && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold mb-2">Appointment Summary</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Doctor:</span> {doctor.name}</p>
                <p><span className="font-medium">Date:</span> {new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><span className="font-medium">Time:</span> {bookingData.time}</p>
                <p><span className="font-medium">Reason:</span> {bookingData.reason}</p>
                <p><span className="font-medium">Fee:</span> {doctor.consultationFee}</p>
              </div>
            </div>

            {/* Patient Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Patient Information</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="patientName">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="patientName"
                      value={bookingData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      className="pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="patientPhone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="patientPhone"
                      value={bookingData.patientPhone}
                      onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                      className="pl-10"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="patientEmail">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="patientEmail"
                      type="email"
                      value={bookingData.patientEmail}
                      onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                      className="pl-10"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={bookingData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any specific symptoms, concerns, or information you'd like the doctor to know..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !bookingData.patientName || !bookingData.patientPhone || !bookingData.patientEmail}
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-6 py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">
                Appointment Booked Successfully!
              </h3>
              <p className="text-muted-foreground">
                Your appointment with {doctor.name} has been confirmed.
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg text-left">
              <h4 className="font-semibold mb-2">Appointment Details</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Date:</span> {new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><span className="font-medium">Time:</span> {bookingData.time}</p>
                <p><span className="font-medium">Location:</span> {doctor.location}</p>
                <p><span className="font-medium">Consultation Fee:</span> {doctor.consultationFee}</p>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>A confirmation email has been sent to {bookingData.patientEmail}</p>
              <p>You can view and manage your appointments in the Appointments section.</p>
            </div>

            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
