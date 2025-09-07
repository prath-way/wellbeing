import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppointmentProvider } from '@/contexts/AppointmentContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { MedicationProvider } from '@/contexts/MedicationContext';
import { AIHealthProvider } from '@/contexts/AIHealthContext';
import { VoiceHealthProvider } from '@/contexts/VoiceHealthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { EmergencyProvider } from '@/contexts/EmergencyContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import Home from '@/pages/Home';
import DoctorSearch from '@/pages/DoctorSearch';
import Appointments from '@/pages/Appointments';
import HealthRecords from '@/pages/HealthRecords';
import WellnessHub from '@/pages/WellnessHub';
import Community from '@/pages/Community';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Medications from '@/pages/Medications';
import AIAssistant from '@/pages/AIAssistant';
import VoiceAssistant from '@/pages/VoiceAssistant';
import Profile from '@/pages/Profile';
import Emergency from '@/pages/Emergency';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <AppointmentProvider>
            <MedicationProvider>
              <AIHealthProvider>
                <VoiceHealthProvider>
                  <EmergencyProvider>
                <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Navigation />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected Routes */}
                <Route path="/search" element={<DoctorSearch />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/records" element={
                  <ProtectedRoute>
                    <HealthRecords />
                  </ProtectedRoute>
                } />
                <Route path="/wellness" element={
                  <ProtectedRoute>
                    <WellnessHub />
                  </ProtectedRoute>
                } />
                <Route path="/community" element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                } />
                <Route path="/medications" element={
                  <ProtectedRoute>
                    <Medications />
                  </ProtectedRoute>
                } />
                <Route path="/ai-assistant" element={
                  <ProtectedRoute>
                    <AIAssistant />
                  </ProtectedRoute>
                } />
                <Route path="/voice-assistant" element={
                  <ProtectedRoute>
                    <VoiceAssistant />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/emergency" element={
                  <ProtectedRoute>
                    <Emergency />
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>
                </TooltipProvider>
                  </EmergencyProvider>
                </VoiceHealthProvider>
              </AIHealthProvider>
            </MedicationProvider>
          </AppointmentProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
