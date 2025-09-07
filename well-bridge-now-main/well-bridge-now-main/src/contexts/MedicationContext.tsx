import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  route: 'oral' | 'injection' | 'topical' | 'inhaled' | 'other';
  prescribedBy: string;
  prescribedDate: string;
  startDate: string;
  endDate?: string;
  refillsRemaining: number;
  totalRefills: number;
  instructions: string;
  sideEffects?: string[];
  isActive: boolean;
  pharmacy?: Pharmacy;
  reminderTimes: string[];
  lastTaken?: string;
  nextDue?: string;
  category: 'prescription' | 'over-the-counter' | 'supplement';
  ndc?: string; // National Drug Code
  strength: string;
  quantity: number;
  daysSupply: number;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  isPreferred: boolean;
}

interface DrugInteraction {
  medication1: string;
  medication2: string;
  severity: 'minor' | 'moderate' | 'major';
  description: string;
  recommendation: string;
}

interface MedicationReminder {
  id: string;
  medicationId: string;
  medicationName: string;
  time: string;
  dosage: string;
  isCompleted: boolean;
  date: string;
  notes?: string;
}

interface RefillAlert {
  id: string;
  medicationId: string;
  medicationName: string;
  refillsRemaining: number;
  daysUntilEmpty: number;
  priority: 'low' | 'medium' | 'high';
  pharmacy: Pharmacy;
}

interface MedicationContextType {
  medications: Medication[];
  pharmacies: Pharmacy[];
  reminders: MedicationReminder[];
  refillAlerts: RefillAlert[];
  interactions: DrugInteraction[];
  
  // Medication management
  addMedication: (medication: Omit<Medication, 'id'>) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  toggleMedicationActive: (id: string) => void;
  
  // Pharmacy management
  addPharmacy: (pharmacy: Omit<Pharmacy, 'id'>) => void;
  updatePharmacy: (id: string, updates: Partial<Pharmacy>) => void;
  setPreferredPharmacy: (id: string) => void;
  
  // Reminders
  markReminderCompleted: (id: string, notes?: string) => void;
  getTodaysReminders: () => MedicationReminder[];
  getUpcomingReminders: () => MedicationReminder[];
  
  // Drug interactions
  checkInteractions: (medicationIds: string[]) => DrugInteraction[];
  
  // Refills
  requestRefill: (medicationId: string, pharmacyId: string) => void;
  getRefillAlerts: () => RefillAlert[];
  
  // Analytics
  getAdherenceRate: (medicationId?: string) => number;
  getMissedDoses: (days: number) => MedicationReminder[];
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const useMedications = () => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedications must be used within a MedicationProvider');
  }
  return context;
};

interface MedicationProviderProps {
  children: ReactNode;
}

export const MedicationProvider: React.FC<MedicationProviderProps> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [refillAlerts, setRefillAlerts] = useState<RefillAlert[]>([]);

  // Mock drug interactions database
  const drugInteractionsDB: DrugInteraction[] = [
    {
      medication1: 'Warfarin',
      medication2: 'Aspirin',
      severity: 'major',
      description: 'Increased risk of bleeding when taken together',
      recommendation: 'Monitor closely for signs of bleeding. Consider alternative medications.'
    },
    {
      medication1: 'Lisinopril',
      medication2: 'Potassium',
      severity: 'moderate',
      description: 'May cause elevated potassium levels',
      recommendation: 'Monitor potassium levels regularly'
    },
    {
      medication1: 'Metformin',
      medication2: 'Alcohol',
      severity: 'moderate',
      description: 'Increased risk of lactic acidosis',
      recommendation: 'Limit alcohol consumption while taking metformin'
    }
  ];

  // Initialize with sample data
  useEffect(() => {
    const samplePharmacies: Pharmacy[] = [
      {
        id: '1',
        name: 'CVS Pharmacy',
        address: '123 Main St, Downtown',
        phone: '(555) 123-4567',
        hours: '8 AM - 10 PM',
        isPreferred: true
      },
      {
        id: '2',
        name: 'Walgreens',
        address: '456 Oak Ave, Midtown',
        phone: '(555) 987-6543',
        hours: '7 AM - 11 PM',
        isPreferred: false
      }
    ];

    const sampleMedications: Medication[] = [
      {
        id: '1',
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        route: 'oral',
        prescribedBy: 'Dr. Sarah Chen',
        prescribedDate: '2024-01-15',
        startDate: '2024-01-16',
        refillsRemaining: 3,
        totalRefills: 5,
        instructions: 'Take with or without food',
        sideEffects: ['Dizziness', 'Dry cough', 'Fatigue'],
        isActive: true,
        pharmacy: samplePharmacies[0],
        reminderTimes: ['08:00'],
        category: 'prescription',
        strength: '10mg',
        quantity: 30,
        daysSupply: 30
      },
      {
        id: '2',
        name: 'Metformin',
        genericName: 'Metformin HCl',
        dosage: '500mg',
        frequency: 'Twice daily',
        route: 'oral',
        prescribedBy: 'Dr. Michael Rodriguez',
        prescribedDate: '2024-02-01',
        startDate: '2024-02-01',
        refillsRemaining: 1,
        totalRefills: 5,
        instructions: 'Take with meals to reduce stomach upset',
        sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste'],
        isActive: true,
        pharmacy: samplePharmacies[0],
        reminderTimes: ['08:00', '20:00'],
        category: 'prescription',
        strength: '500mg',
        quantity: 60,
        daysSupply: 30
      }
    ];

    setPharmacies(samplePharmacies);
    setMedications(sampleMedications);
    generateReminders(sampleMedications);
    generateRefillAlerts(sampleMedications);
  }, []);

  const generateReminders = (meds: Medication[]) => {
    const today = new Date();
    const reminders: MedicationReminder[] = [];

    meds.forEach(med => {
      if (med.isActive) {
        med.reminderTimes.forEach(time => {
          reminders.push({
            id: `${med.id}-${time}-${today.toDateString()}`,
            medicationId: med.id,
            medicationName: med.name,
            time,
            dosage: med.dosage,
            isCompleted: Math.random() > 0.7, // Random completion for demo
            date: today.toISOString().split('T')[0]
          });
        });
      }
    });

    setReminders(reminders);
  };

  const generateRefillAlerts = (meds: Medication[]) => {
    const alerts: RefillAlert[] = [];

    meds.forEach(med => {
      if (med.isActive && med.refillsRemaining <= 2) {
        const daysUntilEmpty = Math.floor(Math.random() * 10) + 1;
        alerts.push({
          id: `alert-${med.id}`,
          medicationId: med.id,
          medicationName: med.name,
          refillsRemaining: med.refillsRemaining,
          daysUntilEmpty,
          priority: daysUntilEmpty <= 3 ? 'high' : daysUntilEmpty <= 7 ? 'medium' : 'low',
          pharmacy: med.pharmacy!
        });
      }
    });

    setRefillAlerts(alerts);
  };

  const addMedication = (medication: Omit<Medication, 'id'>) => {
    const newMedication: Medication = {
      ...medication,
      id: Date.now().toString()
    };
    setMedications(prev => [...prev, newMedication]);
    generateReminders([...medications, newMedication]);
    generateRefillAlerts([...medications, newMedication]);
  };

  const updateMedication = (id: string, updates: Partial<Medication>) => {
    setMedications(prev => 
      prev.map(med => med.id === id ? { ...med, ...updates } : med)
    );
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    setReminders(prev => prev.filter(reminder => reminder.medicationId !== id));
    setRefillAlerts(prev => prev.filter(alert => alert.medicationId !== id));
  };

  const toggleMedicationActive = (id: string) => {
    updateMedication(id, { isActive: !medications.find(m => m.id === id)?.isActive });
  };

  const addPharmacy = (pharmacy: Omit<Pharmacy, 'id'>) => {
    const newPharmacy: Pharmacy = {
      ...pharmacy,
      id: Date.now().toString()
    };
    setPharmacies(prev => [...prev, newPharmacy]);
  };

  const updatePharmacy = (id: string, updates: Partial<Pharmacy>) => {
    setPharmacies(prev => 
      prev.map(pharmacy => pharmacy.id === id ? { ...pharmacy, ...updates } : pharmacy)
    );
  };

  const setPreferredPharmacy = (id: string) => {
    setPharmacies(prev => 
      prev.map(pharmacy => ({ ...pharmacy, isPreferred: pharmacy.id === id }))
    );
  };

  const markReminderCompleted = (id: string, notes?: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, isCompleted: true, notes }
          : reminder
      )
    );
  };

  const getTodaysReminders = () => {
    const today = new Date().toISOString().split('T')[0];
    return reminders.filter(reminder => reminder.date === today);
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    return reminders.filter(reminder => 
      reminder.date === today && 
      reminder.time > currentTime && 
      !reminder.isCompleted
    ).sort((a, b) => a.time.localeCompare(b.time));
  };

  const checkInteractions = (medicationIds: string[]): DrugInteraction[] => {
    const medNames = medications
      .filter(med => medicationIds.includes(med.id))
      .map(med => med.name);

    return drugInteractionsDB.filter(interaction => 
      medNames.includes(interaction.medication1) && medNames.includes(interaction.medication2)
    );
  };

  const requestRefill = (medicationId: string, pharmacyId: string) => {
    // In a real app, this would make an API call to the pharmacy
    console.log(`Refill requested for medication ${medicationId} at pharmacy ${pharmacyId}`);
    
    // Update refills remaining (mock)
    updateMedication(medicationId, { 
      refillsRemaining: medications.find(m => m.id === medicationId)!.refillsRemaining - 1 
    });
  };

  const getRefillAlerts = () => {
    return refillAlerts.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const getAdherenceRate = (medicationId?: string): number => {
    const relevantReminders = medicationId 
      ? reminders.filter(r => r.medicationId === medicationId)
      : reminders;
    
    if (relevantReminders.length === 0) return 100;
    
    const completedCount = relevantReminders.filter(r => r.isCompleted).length;
    return Math.round((completedCount / relevantReminders.length) * 100);
  };

  const getMissedDoses = (days: number): MedicationReminder[] => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return reminders.filter(reminder => 
      !reminder.isCompleted && 
      new Date(reminder.date) >= cutoffDate
    );
  };

  const value = {
    medications,
    pharmacies,
    reminders,
    refillAlerts,
    interactions: drugInteractionsDB,
    addMedication,
    updateMedication,
    deleteMedication,
    toggleMedicationActive,
    addPharmacy,
    updatePharmacy,
    setPreferredPharmacy,
    markReminderCompleted,
    getTodaysReminders,
    getUpcomingReminders,
    checkInteractions,
    requestRefill,
    getRefillAlerts,
    getAdherenceRate,
    getMissedDoses,
  };

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  );
};

export type { Medication, Pharmacy, DrugInteraction, MedicationReminder, RefillAlert };
