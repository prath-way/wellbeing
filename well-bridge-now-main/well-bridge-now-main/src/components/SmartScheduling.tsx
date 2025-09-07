import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAIHealth, type SmartSchedulingSuggestion } from '@/contexts/AIHealthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User,
  Stethoscope,
  Brain,
  AlertTriangle,
  CheckCircle,
  Star,
  Phone,
  Video,
  Building,
  Zap
} from 'lucide-react';

const SmartScheduling = () => {
  const { getSmartSchedulingSuggestions } = useAIHealth();
  const [suggestions, setSuggestions] = useState<SmartSchedulingSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    specialty: '',
    urgency: '',
    location: '',
    appointmentType: ''
  });

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = async () => {
    setIsLoading(true);
    try {
      const smartSuggestions = await getSmartSchedulingSuggestions();
      setSuggestions(smartSuggestions);
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'in-person': return <Building className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filters.specialty && suggestion.specialty !== filters.specialty) return false;
    if (filters.urgency && suggestion.urgency !== filters.urgency) return false;
    if (filters.appointmentType && suggestion.appointmentType !== filters.appointmentType) return false;
    return true;
  });

  const handleBookAppointment = (suggestion: SmartSchedulingSuggestion) => {
    // This would integrate with the actual booking system
    console.log('Booking appointment:', suggestion);
    // For now, just show a success message
    alert(`Appointment booking initiated for ${suggestion.doctorName} on ${suggestion.recommendedDate}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">Smart Appointment Scheduling</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI-powered scheduling recommendations based on your health data, symptoms, and preferences. 
          Get matched with the right specialists at optimal times.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Specialty</Label>
              <Select value={filters.specialty} onValueChange={(value) => setFilters(prev => ({ ...prev, specialty: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All specialties</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="dermatology">Dermatology</SelectItem>
                  <SelectItem value="endocrinology">Endocrinology</SelectItem>
                  <SelectItem value="gastroenterology">Gastroenterology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="primary-care">Primary Care</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Urgency</Label>
              <Select value={filters.urgency} onValueChange={(value) => setFilters(prev => ({ ...prev, urgency: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All urgencies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All urgencies</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Appointment Type</Label>
              <Select value={filters.appointmentType} onValueChange={(value) => setFilters(prev => ({ ...prev, appointmentType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Analyzing your health data and generating recommendations...</p>
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No scheduling recommendations found with current filters.</p>
              <Button variant="outline" onClick={loadSuggestions} className="mt-4">
                Refresh Recommendations
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{suggestion.doctorName}</h4>
                        <p className="text-muted-foreground">{suggestion.specialty}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${
                                  i < suggestion.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">({suggestion.rating}/5)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge variant={getUrgencyBadgeVariant(suggestion.urgency)}>
                        {suggestion.urgency.toUpperCase()}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        Match: {suggestion.matchScore}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Recommended Date:</span>
                        <span>{suggestion.recommendedDate}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Time:</span>
                        <span>{suggestion.recommendedTime}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        {getAppointmentTypeIcon(suggestion.appointmentType)}
                        <span className="font-medium">Type:</span>
                        <span className="capitalize">{suggestion.appointmentType.replace('-', ' ')}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">Location:</span>
                        <span>{suggestion.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Stethoscope className="w-4 h-4 text-red-600" />
                        <span className="font-medium">Wait Time:</span>
                        <span>{suggestion.estimatedWaitTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-medium text-sm mb-2">Why this recommendation?</h5>
                    <p className="text-sm text-muted-foreground">{suggestion.reasonForRecommendation}</p>
                  </div>

                  {suggestion.relevantSymptoms && suggestion.relevantSymptoms.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-medium text-sm mb-2">Addresses your symptoms:</h5>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.relevantSymptoms.map((symptom, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {suggestion.preparationInstructions && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-medium text-sm mb-2 text-blue-900">Preparation Instructions:</h5>
                      <p className="text-sm text-blue-800">{suggestion.preparationInstructions}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Available slots: {suggestion.availableSlots}</span>
                      {suggestion.insuranceAccepted && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span>Insurance accepted</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleBookAppointment(suggestion)}
                      >
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Booking Options */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Booking Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div className="text-left">
                <div className="font-medium">Urgent Care</div>
                <div className="text-sm text-muted-foreground">Same-day appointments</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <Video className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Telemedicine</div>
                <div className="text-sm text-muted-foreground">Virtual consultations</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <Stethoscope className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Preventive Care</div>
                <div className="text-sm text-muted-foreground">Annual check-ups</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="text-center">
        <Button onClick={loadSuggestions} disabled={isLoading}>
          {isLoading ? (
            <>
              <Brain className="w-4 h-4 mr-2 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Refresh Smart Recommendations
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SmartScheduling;
