import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';

// Web Speech API type declarations
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: any;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface VoiceMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audioUrl?: string;
  confidence?: number;
}

interface VoiceSession {
  id: string;
  title: string;
  messages: VoiceMessage[];
  startTime: string;
  endTime?: string;
  category: 'symptom-check' | 'medication' | 'coaching' | 'general';
}

interface VoiceSymptomReport {
  id: string;
  symptoms: string[];
  severity: string;
  duration: string;
  transcript: string;
  confidence: number;
  timestamp: string;
}

interface VoiceMedicationReminder {
  id: string;
  medicationName: string;
  dosage: string;
  time: string;
  frequency: string;
  voiceEnabled: boolean;
  lastReminded?: string;
  acknowledged?: boolean;
}

interface VoiceCoachingSession {
  id: string;
  topic: string;
  duration: number;
  insights: string[];
  recommendations: string[];
  transcript: string;
  timestamp: string;
}

interface VoiceHealthContextType {
  // Voice Recognition
  isListening: boolean;
  isProcessing: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  confidence: number;
  
  // Conversational AI
  currentSession: VoiceSession | null;
  sessionHistory: VoiceSession[];
  sendVoiceMessage: (message: string) => Promise<void>;
  startNewSession: (category: VoiceSession['category']) => void;
  endCurrentSession: () => void;
  
  // Voice Symptom Reporting
  voiceSymptomReports: VoiceSymptomReport[];
  reportSymptomsViaVoice: (transcript: string) => Promise<VoiceSymptomReport>;
  
  // Voice Medication Reminders
  voiceMedicationReminders: VoiceMedicationReminder[];
  setVoiceMedicationReminder: (reminder: Omit<VoiceMedicationReminder, 'id'>) => void;
  acknowledgeVoiceReminder: (id: string) => void;
  
  // Voice Health Coaching
  coachingSessions: VoiceCoachingSession[];
  startVoiceCoaching: (topic: string) => Promise<VoiceCoachingSession>;
  
  // Settings
  voiceSettings: {
    language: string;
    voiceSpeed: number;
    autoSpeak: boolean;
    wakeWord: string;
    privacyMode: boolean;
  };
  updateVoiceSettings: (settings: Partial<VoiceHealthContextType['voiceSettings']>) => void;
  
  // Text-to-Speech
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const VoiceHealthContext = createContext<VoiceHealthContextType | undefined>(undefined);

export const useVoiceHealth = () => {
  const context = useContext(VoiceHealthContext);
  if (context === undefined) {
    throw new Error('useVoiceHealth must be used within a VoiceHealthProvider');
  }
  return context;
};

interface VoiceHealthProviderProps {
  children: ReactNode;
}

export const VoiceHealthProvider: React.FC<VoiceHealthProviderProps> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [currentSession, setCurrentSession] = useState<VoiceSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<VoiceSession[]>([]);
  const [voiceSymptomReports, setVoiceSymptomReports] = useState<VoiceSymptomReport[]>([]);
  const [voiceMedicationReminders, setVoiceMedicationReminders] = useState<VoiceMedicationReminder[]>([]);
  const [coachingSessions, setCoachingSessions] = useState<VoiceCoachingSession[]>([]);
  const [voiceSettings, setVoiceSettings] = useState({
    language: 'en-US',
    voiceSpeed: 1.0,
    autoSpeak: true,
    wakeWord: 'Hey Health',
    privacyMode: false
  });

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition
  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false; // Changed to false for better control
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = voiceSettings.language;
        recognitionRef.current.maxAlternatives = 1;
        
        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setIsListening(true);
        };
        
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            
            if (result.isFinal) {
              finalTranscript += transcript;
              setConfidence(result[0].confidence || 0.8);
            } else {
              interimTranscript += transcript;
            }
          }
          
          const currentTranscript = finalTranscript || interimTranscript;
          setTranscript(currentTranscript);
          console.log('Transcript:', currentTranscript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          // Handle specific errors
          if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please allow microphone access and try again.');
          } else if (event.error === 'no-speech') {
            console.log('No speech detected');
          } else if (event.error === 'network') {
            console.log('Network error occurred');
          }
        };
        
        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
        };
        
        recognitionRef.current.onspeechstart = () => {
          console.log('Speech detected');
        };
        
        recognitionRef.current.onspeechend = () => {
          console.log('Speech ended');
        };
      }
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
    
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }, [voiceSettings.language]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('');
        setConfidence(0);
        console.log('Starting speech recognition...');
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        console.log('Stopping speech recognition...');
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
        setIsListening(false);
      }
    }
  }, [isListening]);

  const speak = useCallback((text: string) => {
    if (synthesisRef.current) {
      // Cancel any ongoing speech
      synthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceSettings.voiceSpeed;
      utterance.lang = voiceSettings.language;
      utterance.volume = 1;
      
      utterance.onstart = () => {
        console.log('Speech synthesis started');
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        console.log('Speech synthesis ended');
        setIsSpeaking(false);
      };
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };
      
      try {
        synthesisRef.current.speak(utterance);
      } catch (error) {
        console.error('Error speaking:', error);
        setIsSpeaking(false);
      }
    }
  }, [voiceSettings.voiceSpeed, voiceSettings.language]);

  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const startNewSession = useCallback((category: VoiceSession['category']) => {
    const newSession: VoiceSession = {
      id: Date.now().toString(),
      title: `${category} session`,
      messages: [],
      startTime: new Date().toISOString(),
      category
    };
    
    setCurrentSession(newSession);
    
    // Welcome message based on category
    const welcomeMessages = {
      'symptom-check': "Hello! I'm here to help you report your symptoms. Please describe how you're feeling.",
      'medication': "Hi! I can help you with medication reminders and questions. What would you like to know?",
      'coaching': "Welcome to your health coaching session! What health goal would you like to work on today?",
      'general': "Hello! I'm your AI health companion. How can I help you today?"
    };
    
    const welcomeMessage: VoiceMessage = {
      id: '1',
      type: 'assistant',
      content: welcomeMessages[category],
      timestamp: new Date().toISOString()
    };
    
    newSession.messages.push(welcomeMessage);
    setCurrentSession(newSession);
    
    if (voiceSettings.autoSpeak) {
      speak(welcomeMessage.content);
    }
  }, [voiceSettings.autoSpeak, speak]);

  const generateAIResponse = useCallback(async (message: string, category: VoiceSession['category']): Promise<string> => {
    const lowerMessage = message.toLowerCase();
    
    // Category-specific responses
    switch (category) {
      case 'symptom-check':
        if (lowerMessage.includes('headache')) {
          return "I understand you're experiencing a headache. Can you tell me how severe it is on a scale of 1 to 10, and how long you've had it?";
        }
        if (lowerMessage.includes('fever')) {
          return "A fever can indicate your body is fighting an infection. Have you taken your temperature? Any other symptoms like chills or body aches?";
        }
        if (lowerMessage.includes('pain')) {
          return "I'm sorry you're in pain. Can you describe where the pain is located and what type of pain it is - sharp, dull, throbbing?";
        }
        return "Thank you for sharing that information. Can you provide more details about when these symptoms started and their severity?";
        
      case 'medication':
        if (lowerMessage.includes('reminder')) {
          return "I can help set up medication reminders for you. What medication do you need reminders for, and what time should I remind you?";
        }
        if (lowerMessage.includes('side effect')) {
          return "Side effects can be concerning. What medication are you taking, and what symptoms are you experiencing? I recommend consulting your doctor about this.";
        }
        return "I'm here to help with your medication questions. What would you like to know about your medications?";
        
      case 'coaching':
        if (lowerMessage.includes('exercise') || lowerMessage.includes('fitness')) {
          return "Great choice! Regular exercise is key to good health. What's your current activity level, and what are your fitness goals?";
        }
        if (lowerMessage.includes('diet') || lowerMessage.includes('nutrition')) {
          return "Nutrition plays a huge role in health. What specific dietary goals do you have? Are you looking to lose weight, eat healthier, or manage a condition?";
        }
        if (lowerMessage.includes('sleep')) {
          return "Sleep is crucial for health and recovery. Are you having trouble falling asleep, staying asleep, or feeling rested when you wake up?";
        }
        return "I'm excited to help you on your health journey! What specific area would you like to focus on improving?";
        
      default:
        return "I'm here to help with your health questions. You can ask me about symptoms, medications, or get health coaching. What would you like to discuss?";
    }
  }, []);

  const sendVoiceMessage = useCallback(async (message: string) => {
    if (!currentSession) return;
    
    setIsProcessing(true);
    
    // Add user message
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      confidence
    };
    
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage]
    };
    
    setCurrentSession(updatedSession);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate AI response based on session category and message content
    const aiResponse = await generateAIResponse(message, currentSession.category);
    
    const assistantMessage: VoiceMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString()
    };
    
    const finalSession = {
      ...updatedSession,
      messages: [...updatedSession.messages, assistantMessage]
    };
    
    setCurrentSession(finalSession);
    setIsProcessing(false);
    
    if (voiceSettings.autoSpeak) {
      speak(aiResponse);
    }
  }, [currentSession, confidence, voiceSettings.autoSpeak, speak, generateAIResponse]);

  const endCurrentSession = useCallback(() => {
    if (currentSession) {
      const endedSession = {
        ...currentSession,
        endTime: new Date().toISOString()
      };
      
      setSessionHistory(prev => [endedSession, ...prev]);
      setCurrentSession(null);
    }
  }, [currentSession]);

  const reportSymptomsViaVoice = useCallback(async (transcript: string): Promise<VoiceSymptomReport> => {
    // Extract symptoms from transcript using simple keyword matching
    const symptomKeywords = ['headache', 'fever', 'cough', 'pain', 'nausea', 'fatigue', 'dizziness'];
    const foundSymptoms = symptomKeywords.filter(symptom => 
      transcript.toLowerCase().includes(symptom)
    );
    
    // Extract severity
    let severity = 'mild';
    if (transcript.toLowerCase().includes('severe') || transcript.toLowerCase().includes('terrible')) {
      severity = 'severe';
    } else if (transcript.toLowerCase().includes('moderate') || transcript.toLowerCase().includes('bad')) {
      severity = 'moderate';
    }
    
    // Extract duration
    let duration = 'recent';
    if (transcript.toLowerCase().includes('days')) {
      duration = 'few days';
    } else if (transcript.toLowerCase().includes('week')) {
      duration = 'about a week';
    }
    
    const report: VoiceSymptomReport = {
      id: Date.now().toString(),
      symptoms: foundSymptoms,
      severity,
      duration,
      transcript,
      confidence,
      timestamp: new Date().toISOString()
    };
    
    setVoiceSymptomReports(prev => [report, ...prev]);
    return report;
  }, [confidence]);

  const setVoiceMedicationReminder = useCallback((reminder: Omit<VoiceMedicationReminder, 'id'>) => {
    const newReminder: VoiceMedicationReminder = {
      ...reminder,
      id: Date.now().toString()
    };
    
    setVoiceMedicationReminders(prev => [...prev, newReminder]);
  }, []);

  const acknowledgeVoiceReminder = useCallback((id: string) => {
    setVoiceMedicationReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, acknowledged: true, lastReminded: new Date().toISOString() }
          : reminder
      )
    );
  }, []);

  const startVoiceCoaching = useCallback(async (topic: string): Promise<VoiceCoachingSession> => {
    const session: VoiceCoachingSession = {
      id: Date.now().toString(),
      topic,
      duration: 0,
      insights: [],
      recommendations: [],
      transcript: '',
      timestamp: new Date().toISOString()
    };
    
    // Generate coaching content based on topic
    switch (topic.toLowerCase()) {
      case 'exercise':
        session.insights = [
          'Regular exercise improves cardiovascular health',
          'Strength training helps maintain bone density',
          'Even 30 minutes daily can make a significant difference'
        ];
        session.recommendations = [
          'Start with 150 minutes of moderate exercise per week',
          'Include both cardio and strength training',
          'Find activities you enjoy to stay consistent'
        ];
        break;
      case 'nutrition':
        session.insights = [
          'A balanced diet provides essential nutrients',
          'Processed foods can increase health risks',
          'Hydration is crucial for all body functions'
        ];
        session.recommendations = [
          'Eat 5-7 servings of fruits and vegetables daily',
          'Choose whole grains over refined grains',
          'Limit added sugars and sodium'
        ];
        break;
      default:
        session.insights = ['Consistency is key to health improvements'];
        session.recommendations = ['Set small, achievable goals'];
    }
    
    setCoachingSessions(prev => [session, ...prev]);
    return session;
  }, []);

  const updateVoiceSettings = useCallback((newSettings: Partial<VoiceHealthContextType['voiceSettings']>) => {
    setVoiceSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const value: VoiceHealthContextType = {
    isListening,
    isProcessing,
    startListening,
    stopListening,
    transcript,
    confidence,
    currentSession,
    sessionHistory,
    sendVoiceMessage,
    startNewSession,
    endCurrentSession,
    voiceSymptomReports,
    reportSymptomsViaVoice,
    voiceMedicationReminders,
    setVoiceMedicationReminder,
    acknowledgeVoiceReminder,
    coachingSessions,
    startVoiceCoaching,
    voiceSettings,
    updateVoiceSettings,
    speak,
    stopSpeaking,
    isSpeaking
  };

  return (
    <VoiceHealthContext.Provider value={value}>
      {children}
    </VoiceHealthContext.Provider>
  );
};

export { 
  type VoiceMessage, 
  type VoiceSession, 
  type VoiceSymptomReport, 
  type VoiceMedicationReminder, 
  type VoiceCoachingSession 
};
