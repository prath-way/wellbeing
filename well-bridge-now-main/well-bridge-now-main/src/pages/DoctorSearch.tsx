import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useAppointments } from '@/contexts/AppointmentContext';
import BookingModal from '@/components/BookingModal';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Video, 
  Calendar,
  Shield,
  Filter,
  Heart,
  Stethoscope,
  Eye,
  Brain
} from 'lucide-react';

const DoctorSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { addAppointment } = useAppointments();
  const { toast } = useToast();

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      specialty: 'Cardiology',
      rating: 4.9,
      reviews: 127,
      location: 'Downtown Medical Center',
      distance: '0.8 miles',
      availability: 'Available today',
      consultationFee: '$75',
      verified: true,
      languages: ['English', 'Mandarin'],
      experience: '15+ years',
      avatar: '/api/placeholder/64/64'
    },
    {
      id: 2,
      name: 'Dr. Michael Rodriguez',
      specialty: 'Dermatology',
      rating: 4.8,
      reviews: 89,
      location: 'Westside Clinic',
      distance: '1.2 miles',
      availability: 'Available tomorrow',
      consultationFee: '$85',
      verified: true,
      languages: ['English', 'Spanish'],
      experience: '12+ years',
      avatar: '/api/placeholder/64/64'
    },
    {
      id: 3,
      name: 'Dr. Emily Johnson',
      specialty: 'Pediatrics',
      rating: 4.9,
      reviews: 156,
      location: 'Children\'s Medical Center',
      distance: '2.1 miles',
      availability: 'Available today',
      consultationFee: '$65',
      verified: true,
      languages: ['English'],
      experience: '18+ years',
      avatar: '/api/placeholder/64/64'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Ophthalmology',
      rating: 4.7,
      reviews: 203,
      location: 'Eye Care Specialists',
      distance: '1.5 miles',
      availability: 'Available this week',
      consultationFee: '$95',
      verified: true,
      languages: ['English'],
      experience: '20+ years',
      avatar: '/api/placeholder/64/64'
    },
    {
      id: 5,
      name: 'Dr. Lisa Thompson',
      specialty: 'Neurology',
      rating: 4.8,
      reviews: 98,
      location: 'Brain & Spine Institute',
      distance: '2.3 miles',
      availability: 'Next week',
      consultationFee: '$120',
      verified: true,
      languages: ['English', 'French'],
      experience: '20+ years',
      avatar: '/api/placeholder/64/64'
    }
  ];

  const specialties = [
    { name: 'Cardiology', icon: Heart },
    { name: 'Dermatology', icon: Shield },
    { name: 'Pediatrics', icon: Stethoscope },
    { name: 'Neurology', icon: Brain },
    { name: 'Ophthalmology', icon: Eye }
  ];

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (appointment: any) => {
    addAppointment(appointment);
    toast({
      title: "Appointment Booked Successfully! ✅",
      description: `Your appointment with ${appointment.doctorName} is scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}`,
      duration: 5000,
    });
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedDoctor(null);
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    const matchesSearch = !searchQuery || 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Find Healthcare Providers
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Search and book appointments with qualified doctors in your area
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Search by doctor name, specialty, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 pr-40 h-16 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button
            variant={!selectedSpecialty ? "default" : "outline"}
            onClick={() => setSelectedSpecialty('')}
            className="rounded-full"
          >
            All Specialties
          </Button>
          {specialties.map((specialty) => (
            <Button
              key={specialty.name}
              variant={selectedSpecialty === specialty.name ? "default" : "outline"}
              onClick={() => setSelectedSpecialty(
                selectedSpecialty === specialty.name ? '' : specialty.name
              )}
              className="rounded-full"
            >
              <specialty.icon className="w-4 h-4 mr-2" />
              {specialty.name}
            </Button>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
              {filteredDoctors.length} doctors found
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {selectedSpecialty ? `Showing ${selectedSpecialty} specialists` : 'All available doctors in your area'}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-200 dark:border-gray-700"
          >
            Sort by: Rating
          </Button>
        </div>

        {/* Doctor Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Doctor Avatar */}
                    <Avatar className="w-16 h-16 ring-2 ring-gray-100 dark:ring-gray-700">
                      <AvatarImage src={doctor.avatar} />
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      {/* Doctor Name & Verification */}
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                          {doctor.name}
                        </h3>
                        {doctor.verified && (
                          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      {/* Specialty */}
                      <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">{doctor.specialty}</p>

                      {/* Rating & Location */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current text-yellow-500" />
                          <span className="font-medium">{doctor.rating}</span>
                          <span>({doctor.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{doctor.distance}</span>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          <Clock className="w-3 h-3 mr-1" />
                          {doctor.availability}
                        </Badge>
                        <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
                          {doctor.experience}
                        </Badge>
                        {doctor.languages.slice(0, 2).map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs border-gray-200 dark:border-gray-700">
                            {lang}
                          </Badge>
                        ))}
                      </div>

                      {/* Location */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{doctor.location}</p>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          size="sm"
                          onClick={() => handleBookAppointment(doctor)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Appointment
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Video Call
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No doctors found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedSpecialty 
                      ? `No doctors found for ${selectedSpecialty}. Try a different specialty or clear the filter.`
                      : 'Try adjusting your search criteria or filters.'
                    }
                  </p>
                  {selectedSpecialty && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedSpecialty('')}
                      className="border-gray-200 dark:border-gray-700"
                    >
                      Clear Filter
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredDoctors.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Load More Doctors
            </Button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        doctor={selectedDoctor}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
};

export default DoctorSearch;