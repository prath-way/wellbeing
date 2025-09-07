import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

interface MedicalInfo {
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyNotes: string;
}

interface EmergencyContextType {
  emergencyContacts: EmergencyContact[];
  medicalInfo: MedicalInfo;
  isEmergencyActive: boolean;
  location: { lat: number; lng: number } | null;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  updateEmergencyContact: (id: string, contact: Partial<EmergencyContact>) => void;
  removeEmergencyContact: (id: string) => void;
  updateMedicalInfo: (info: Partial<MedicalInfo>) => void;
  triggerEmergency: () => void;
  cancelEmergency: () => void;
  getCurrentLocation: () => Promise<{ lat: number; lng: number } | null>;
  shareLocation: () => void;
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};

interface EmergencyProviderProps {
  children: React.ReactNode;
}

export const EmergencyProvider: React.FC<EmergencyProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543',
      isPrimary: true
    },
    {
      id: '2',
      name: 'Dr. Smith',
      relationship: 'Primary Care Doctor',
      phone: '+1 (555) 123-4567',
      isPrimary: false
    }
  ]);

  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo>({
    bloodType: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    medications: ['Lisinopril 10mg', 'Metformin 500mg'],
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    emergencyNotes: 'Patient has history of heart palpitations. Prefers local hospital.'
  });

  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const addEmergencyContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: Date.now().toString()
    };
    setEmergencyContacts(prev => [...prev, newContact]);
    toast({
      title: "Emergency Contact Added ✅",
      description: `${contact.name} has been added to your emergency contacts.`,
    });
  };

  const updateEmergencyContact = (id: string, updatedContact: Partial<EmergencyContact>) => {
    setEmergencyContacts(prev =>
      prev.map(contact =>
        contact.id === id ? { ...contact, ...updatedContact } : contact
      )
    );
    toast({
      title: "Contact Updated ✅",
      description: "Emergency contact has been updated successfully.",
    });
  };

  const removeEmergencyContact = (id: string) => {
    setEmergencyContacts(prev => prev.filter(contact => contact.id !== id));
    toast({
      title: "Contact Removed",
      description: "Emergency contact has been removed.",
    });
  };

  const updateMedicalInfo = (info: Partial<MedicalInfo>) => {
    setMedicalInfo(prev => ({ ...prev, ...info }));
    toast({
      title: "Medical Info Updated ✅",
      description: "Your emergency medical information has been updated.",
    });
  };

  const getCurrentLocation = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        toast({
          title: "Location Not Available",
          description: "Geolocation is not supported by this browser.",
          variant: "destructive",
        });
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(coords);
          resolve(coords);
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please enable location services.",
            variant: "destructive",
          });
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const shareLocation = async () => {
    const currentLocation = await getCurrentLocation();
    if (currentLocation) {
      const locationUrl = `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'My Emergency Location',
            text: 'I need help! Here is my current location:',
            url: locationUrl,
          });
        } catch (error) {
          // Fallback to copying to clipboard
          navigator.clipboard.writeText(`Emergency Location: ${locationUrl}`);
          toast({
            title: "Location Copied",
            description: "Location link copied to clipboard.",
          });
        }
      } else {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(`Emergency Location: ${locationUrl}`);
        toast({
          title: "Location Copied",
          description: "Location link copied to clipboard.",
        });
      }
    }
  };

  const triggerEmergency = async () => {
    setIsEmergencyActive(true);
    
    // Get current location
    await getCurrentLocation();
    
    // Simulate emergency services notification
    toast({
      title: "🚨 EMERGENCY ACTIVATED",
      description: "Emergency services have been notified. Help is on the way.",
      variant: "destructive",
    });

    // Simulate contacting emergency contacts
    setTimeout(() => {
      const primaryContact = emergencyContacts.find(contact => contact.isPrimary);
      if (primaryContact) {
        toast({
          title: "Emergency Contact Notified",
          description: `${primaryContact.name} has been notified of your emergency.`,
        });
      }
    }, 2000);
  };

  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    toast({
      title: "Emergency Cancelled",
      description: "Emergency alert has been cancelled.",
    });
  };

  // Auto-cancel emergency after 5 minutes (for demo purposes)
  useEffect(() => {
    if (isEmergencyActive) {
      const timer = setTimeout(() => {
        setIsEmergencyActive(false);
        toast({
          title: "Emergency Auto-Cancelled",
          description: "Emergency alert has been automatically cancelled after 5 minutes.",
        });
      }, 300000); // 5 minutes

      return () => clearTimeout(timer);
    }
  }, [isEmergencyActive, toast]);

  const value = {
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
    shareLocation,
  };

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
};

export default EmergencyProvider;
