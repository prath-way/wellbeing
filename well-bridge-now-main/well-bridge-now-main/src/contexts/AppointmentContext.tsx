import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Appointment {
  id: number;
  doctorId: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  reason: string;
  notes: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  location: string;
  consultationFee: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  createdAt: string;
}

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: number, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: number) => void;
  getUpcomingAppointments: () => Appointment[];
  getPastAppointments: () => Appointment[];
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

interface AppointmentProviderProps {
  children: ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    // Test appointment to verify display
    {
      id: 1,
      doctorId: 1,
      doctorName: 'Dr. Test Doctor',
      specialty: 'General Medicine',
      date: '2025-09-08',
      time: '10:00 AM',
      reason: 'Test appointment',
      notes: 'This is a test',
      status: 'confirmed',
      location: 'Test Clinic',
      consultationFee: '$50',
      patientName: 'Test Patient',
      patientPhone: '+1234567890',
      patientEmail: 'test@example.com',
      createdAt: new Date().toISOString()
    }
  ]);

  const addAppointment = (appointment: Appointment) => {
    console.log('Adding appointment:', appointment);
    setAppointments(prev => {
      const newAppointments = [...prev, appointment];
      console.log('Updated appointments list:', newAppointments);
      return newAppointments;
    });
  };

  const updateAppointment = (id: number, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id ? { ...appointment, ...updates } : appointment
      )
    );
  };

  const cancelAppointment = (id: number) => {
    updateAppointment(id, { status: 'cancelled' });
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    console.log('Current appointments:', appointments);
    console.log('Current time:', now);
    
    const upcoming = appointments.filter(appointment => {
      const appointmentDate = new Date(`${appointment.date} ${appointment.time}`);
      console.log(`Checking appointment: ${appointment.date} ${appointment.time}, parsed date:`, appointmentDate, 'is future:', appointmentDate > now);
      return appointmentDate > now && appointment.status !== 'cancelled';
    }).sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());
    
    console.log('Upcoming appointments:', upcoming);
    return upcoming;
  };

  const getPastAppointments = () => {
    const now = new Date();
    return appointments.filter(appointment => {
      const appointmentDate = new Date(`${appointment.date} ${appointment.time}`);
      return appointmentDate <= now || appointment.status === 'completed';
    }).sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime());
  };

  const value = {
    appointments,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    getUpcomingAppointments,
    getPastAppointments,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export type { Appointment };
