import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEmergency } from '@/contexts/EmergencyContext';
import { 
  Phone, 
  MapPin, 
  AlertTriangle, 
  Heart, 
  Users, 
  Plus,
  Edit,
  Trash2,
  Share,
  Navigation,
  Clock,
  Shield,
  Siren,
  X,
  Check,
  Copy,
  ExternalLink
} from 'lucide-react';

const Emergency = () => {
  const {
    emergencyContacts,
    medicalInfo,
    isEmergencyActive,
    location,
    addEmergencyContact,
    updateEmergencyContact,
    removeEmergencyContact,
    updateMedicalInfo,
    triggerEmergency,
    cancelEmergency,
    getCurrentLocation,
    shareLocation
  } = useEmergency();

  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relationship: '',
    phone: '',
    isPrimary: false
  });
  const [emergencyTimer, setEmergencyTimer] = useState(0);

  // Emergency countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isEmergencyActive) {
      interval = setInterval(() => {
        setEmergencyTimer(prev => prev + 1);
      }, 1000);
    } else {
      setEmergencyTimer(0);
    }
    return () => clearInterval(interval);
  }, [isEmergencyActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      addEmergencyContact(newContact);
      setNewContact({ name: '', relationship: '', phone: '', isPrimary: false });
      setIsAddingContact(false);
    }
  };

  const callEmergencyServices = () => {
    window.open('tel:911', '_self');
  };

  const callContact = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const openMaps = () => {
    if (location) {
      window.open(`https://maps.google.com/?q=${location.lat},${location.lng}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Alert Banner */}
        {isEmergencyActive && (
          <div className="mb-6 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg shadow-lg animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center animate-bounce">
                  <Siren className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-900 dark:text-red-100">
                    🚨 EMERGENCY ACTIVE
                  </h2>
                  <p className="text-red-700 dark:text-red-200">
                    Emergency services notified • Timer: {formatTime(emergencyTimer)}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={cancelEmergency}
                className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Emergency
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Emergency Center
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Quick access to emergency services and your emergency information
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            size="lg"
            className="h-20 bg-red-600 hover:bg-red-700 text-white shadow-lg"
            onClick={triggerEmergency}
            disabled={isEmergencyActive}
          >
            <div className="flex flex-col items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-semibold">SOS Emergency</span>
            </div>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-20 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
            onClick={callEmergencyServices}
          >
            <div className="flex flex-col items-center gap-2">
              <Phone className="w-6 h-6" />
              <span className="font-semibold">Call 911</span>
            </div>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-20"
            onClick={shareLocation}
          >
            <div className="flex flex-col items-center gap-2">
              <Share className="w-6 h-6" />
              <span className="font-semibold">Share Location</span>
            </div>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-20"
            onClick={openMaps}
            disabled={!location}
          >
            <div className="flex flex-col items-center gap-2">
              <Navigation className="w-6 h-6" />
              <span className="font-semibold">Open Maps</span>
            </div>
          </Button>
        </div>

        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
            <TabsTrigger value="medical">Medical Info</TabsTrigger>
            <TabsTrigger value="location">Location & Services</TabsTrigger>
          </TabsList>

          {/* Emergency Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Emergency Contacts</h2>
              <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Emergency Contact</DialogTitle>
                    <DialogDescription>
                      Add a new emergency contact who will be notified in case of an emergency.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newContact.name}
                        onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select
                        value={newContact.relationship}
                        onValueChange={(value) => setNewContact(prev => ({ ...prev, relationship: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Parent">Parent</SelectItem>
                          <SelectItem value="Child">Child</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Friend">Friend</SelectItem>
                          <SelectItem value="Doctor">Doctor</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={newContact.phone}
                        onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPrimary"
                        checked={newContact.isPrimary}
                        onChange={(e) => setNewContact(prev => ({ ...prev, isPrimary: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="isPrimary">Set as primary contact</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddContact} className="flex-1">
                        Add Contact
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddingContact(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact) => (
                <Card key={contact.id} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback>
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {contact.name}
                            {contact.isPrimary && (
                              <Badge variant="secondary" className="text-xs">
                                <Shield className="w-3 h-3 mr-1" />
                                Primary
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {contact.relationship}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{contact.phone}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => callContact(contact.phone)}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => removeEmergencyContact(contact.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Medical Information Tab */}
          <TabsContent value="medical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Emergency Medical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Blood Type</Label>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {medicalInfo.bloodType}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Allergies</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {medicalInfo.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-sm">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Current Medications</Label>
                  <div className="mt-2 space-y-2">
                    {medicalInfo.medications.map((medication, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">{medication}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Medical Conditions</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {medicalInfo.conditions.map((condition, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Emergency Notes</Label>
                  <div className="mt-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      {medicalInfo.emergencyNotes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location & Services Tab */}
          <TabsContent value="location" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Current Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {location ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                        <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-medium">Location Available</span>
                        </div>
                        <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                          Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" onClick={shareLocation} className="flex-1">
                          <Share className="w-4 h-4 mr-2" />
                          Share Location
                        </Button>
                        <Button size="sm" variant="outline" onClick={openMaps}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Maps
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Location not available. Click below to get your current location.
                        </p>
                      </div>
                      <Button onClick={getCurrentLocation} className="w-full">
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Current Location
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nearby Emergency Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">Emergency Services</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">911</p>
                      </div>
                      <Button size="sm" onClick={callEmergencyServices}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">Poison Control</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">1-800-222-1222</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">Crisis Hotline</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">988</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Emergency;
