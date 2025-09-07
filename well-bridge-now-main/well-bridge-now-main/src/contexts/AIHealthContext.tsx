import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  frequency: 'constant' | 'intermittent' | 'occasional';
  location?: string;
  description?: string;
  associatedSymptoms?: string[];
}

interface SymptomAnalysis {
  id: string;
  symptoms: Symptom[];
  analysis: {
    possibleConditions: PossibleCondition[];
    urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
    recommendations: string[];
    nextSteps: string[];
    redFlags: string[];
  };
  confidence: number;
  timestamp: string;
}

interface PossibleCondition {
  name: string;
  probability: number;
  description: string;
  commonSymptoms: string[];
  whenToSeeDoctor: string;
  selfCareOptions?: string[];
}

interface HealthRisk {
  id: string;
  riskType: string;
  riskLevel: 'low' | 'moderate' | 'high';
  probability: number;
  description: string;
  factors: string[];
  recommendations: string[];
  timeframe: string;
  basedOn: string[];
}

interface PersonalizedRecommendation {
  id: string;
  category: 'lifestyle' | 'diet' | 'exercise' | 'medication' | 'preventive';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionItems: string[];
  expectedBenefit: string;
  timeToSeeResults: string;
  basedOn: string[];
}

interface HealthRecommendation {
  id: string;
  category: 'fitness' | 'nutrition' | 'mental-health' | 'sleep' | 'preventive-care' | 'lifestyle';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionSteps: string[];
  estimatedTimeframe?: string;
  potentialImpact?: string;
  difficulty?: 'easy' | 'moderate' | 'challenging';
  evidenceLevel?: number;
  relatedConditions?: string[];
}

interface SmartSchedulingSuggestion {
  id: string;
  doctorName: string;
  specialty: string;
  appointmentType: 'in-person' | 'video' | 'phone';
  recommendedDate: string;
  recommendedTime: string;
  location: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  matchScore: number;
  rating: number;
  estimatedWaitTime: string;
  reasonForRecommendation: string;
  relevantSymptoms?: string[];
  preparationInstructions?: string;
  availableSlots: number;
  insuranceAccepted: boolean;
  suggestedTiming?: string;
  reasoning?: string;
  priority?: 'routine' | 'recommended' | 'urgent';
  doctorSpecialty?: string;
  estimatedDuration?: string;
}

interface AIHealthContextType {
  // Symptom Checker
  analyzeSymptoms: (symptoms: Symptom[]) => Promise<SymptomAnalysis>;
  getSymptomHistory: () => SymptomAnalysis[];
  
  // Health Risk Predictions
  assessHealthRisks: () => Promise<HealthRisk[]>;
  getHealthRiskTrends: () => HealthRisk[];
  
  // Personalized Recommendations
  getPersonalizedRecommendations: () => Promise<PersonalizedRecommendation[]>;
  markRecommendationCompleted: (id: string) => void;
  
  // Smart Scheduling
  getSchedulingSuggestions: () => Promise<SmartSchedulingSuggestion[]>;
  getSmartSchedulingSuggestions: () => Promise<SmartSchedulingSuggestion[]>;
  
  // AI Chat
  askHealthQuestion: (question: string) => Promise<string>;
  
  // State
  isAnalyzing: boolean;
  lastAnalysis?: SymptomAnalysis;
  healthRisks: HealthRisk[];
  recommendations: PersonalizedRecommendation[];
  schedulingSuggestions: SmartSchedulingSuggestion[];
}

const AIHealthContext = createContext<AIHealthContextType | undefined>(undefined);

export const useAIHealth = () => {
  const context = useContext(AIHealthContext);
  if (context === undefined) {
    throw new Error('useAIHealth must be used within an AIHealthProvider');
  }
  return context;
};

interface AIHealthProviderProps {
  children: ReactNode;
}

export const AIHealthProvider: React.FC<AIHealthProviderProps> = ({ children }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<SymptomAnalysis>();
  const [symptomHistory, setSymptomHistory] = useState<SymptomAnalysis[]>([]);
  const [healthRisks, setHealthRisks] = useState<HealthRisk[]>([]);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [schedulingSuggestions, setSchedulingSuggestions] = useState<SmartSchedulingSuggestion[]>([]);

  // Mock medical knowledge base
  const medicalConditions = [
    {
      name: 'Common Cold',
      symptoms: ['runny nose', 'sore throat', 'cough', 'sneezing', 'fatigue'],
      severity: 'mild',
      description: 'Viral infection of the upper respiratory tract'
    },
    {
      name: 'Influenza',
      symptoms: ['fever', 'body aches', 'fatigue', 'cough', 'headache'],
      severity: 'moderate',
      description: 'Viral infection affecting the respiratory system'
    },
    {
      name: 'Migraine',
      symptoms: ['severe headache', 'nausea', 'light sensitivity', 'sound sensitivity'],
      severity: 'moderate',
      description: 'Neurological condition causing severe headaches'
    },
    {
      name: 'Gastroenteritis',
      symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'fever'],
      severity: 'moderate',
      description: 'Inflammation of the stomach and intestines'
    }
  ];

  const analyzeSymptoms = async (symptoms: Symptom[]): Promise<SymptomAnalysis> => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Mock AI analysis logic
      const symptomNames = symptoms.map(s => s.name.toLowerCase());
      const severityScores = symptoms.map(s => {
        switch (s.severity) {
          case 'mild': return 1;
          case 'moderate': return 2;
          case 'severe': return 3;
          default: return 1;
        }
      });
      
      const avgSeverity = severityScores.reduce((a, b) => a + b, 0) / severityScores.length;
      
      // Match symptoms to conditions
      const possibleConditions: PossibleCondition[] = medicalConditions
        .map(condition => {
          const matchingSymptoms = condition.symptoms.filter(symptom =>
            symptomNames.some(userSymptom => 
              userSymptom.includes(symptom) || symptom.includes(userSymptom)
            )
          );
          
          const probability = (matchingSymptoms.length / condition.symptoms.length) * 100;
          
          return {
            name: condition.name,
            probability,
            description: condition.description,
            commonSymptoms: condition.symptoms,
            whenToSeeDoctor: probability > 60 ? 'Consider seeing a doctor if symptoms persist' : 'Monitor symptoms',
            selfCareOptions: ['Rest', 'Stay hydrated', 'Over-the-counter pain relief if needed']
          };
        })
        .filter(condition => condition.probability > 20)
        .sort((a, b) => b.probability - a.probability);

      // Determine urgency level
      let urgencyLevel: 'low' | 'medium' | 'high' | 'emergency' = 'low';
      const hasRedFlags = symptoms.some(s => 
        s.severity === 'severe' || 
        s.name.toLowerCase().includes('chest pain') ||
        s.name.toLowerCase().includes('difficulty breathing')
      );
      
      if (hasRedFlags) urgencyLevel = 'emergency';
      else if (avgSeverity > 2.5) urgencyLevel = 'high';
      else if (avgSeverity > 1.5) urgencyLevel = 'medium';

      // Generate recommendations
      const recommendations = [
        'Monitor your symptoms closely',
        'Stay hydrated and get plenty of rest',
        'Consider over-the-counter medications for symptom relief'
      ];

      if (urgencyLevel === 'high' || urgencyLevel === 'emergency') {
        recommendations.unshift('Seek medical attention promptly');
      }

      // Generate red flags
      const redFlags = [];
      if (symptoms.some(s => s.name.toLowerCase().includes('chest pain'))) {
        redFlags.push('Chest pain can indicate serious conditions - seek immediate medical attention');
      }
      if (symptoms.some(s => s.name.toLowerCase().includes('difficulty breathing'))) {
        redFlags.push('Breathing difficulties require immediate medical evaluation');
      }

      const analysis: SymptomAnalysis = {
        id: Date.now().toString(),
        symptoms,
        analysis: {
          possibleConditions,
          urgencyLevel,
          recommendations,
          nextSteps: [
            'Continue monitoring symptoms',
            'Schedule appointment if symptoms worsen',
            'Keep a symptom diary'
          ],
          redFlags
        },
        confidence: Math.min(95, Math.max(60, possibleConditions[0]?.probability || 60)),
        timestamp: new Date().toISOString()
      };

      setLastAnalysis(analysis);
      setSymptomHistory(prev => [analysis, ...prev]);
      
      return analysis;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSymptomHistory = (): SymptomAnalysis[] => {
    return symptomHistory;
  };

  const assessHealthRisks = async (): Promise<HealthRisk[]> => {
    // Mock health risk assessment based on user data
    const mockRisks: HealthRisk[] = [
      {
        id: '1',
        riskType: 'Cardiovascular Disease',
        riskLevel: 'moderate',
        probability: 25,
        description: 'Based on your health profile, you have a moderate risk of developing cardiovascular disease',
        factors: ['Family history', 'Sedentary lifestyle', 'Stress levels'],
        recommendations: [
          'Increase physical activity to 150 minutes per week',
          'Adopt a heart-healthy diet',
          'Manage stress through relaxation techniques',
          'Regular blood pressure monitoring'
        ],
        timeframe: 'Next 10 years',
        basedOn: ['Health records', 'Lifestyle data', 'Family history']
      },
      {
        id: '2',
        riskType: 'Type 2 Diabetes',
        riskLevel: 'low',
        probability: 15,
        description: 'Your current lifestyle and health indicators suggest a low risk for Type 2 diabetes',
        factors: ['BMI within normal range', 'Active lifestyle', 'No family history'],
        recommendations: [
          'Maintain current healthy lifestyle',
          'Continue regular exercise routine',
          'Annual blood glucose screening'
        ],
        timeframe: 'Next 10 years',
        basedOn: ['BMI data', 'Exercise tracking', 'Lab results']
      }
    ];

    setHealthRisks(mockRisks);
    return mockRisks;
  };

  const getHealthRiskTrends = (): HealthRisk[] => {
    return healthRisks;
  };

  const getPersonalizedRecommendations = async (): Promise<PersonalizedRecommendation[]> => {
    const mockRecommendations: PersonalizedRecommendation[] = [
      {
        id: '1',
        category: 'exercise',
        title: 'Increase Daily Steps',
        description: 'Based on your activity data, increasing daily steps could improve your cardiovascular health',
        priority: 'high',
        actionItems: [
          'Set a goal of 8,000 steps per day',
          'Take stairs instead of elevators',
          'Go for a 15-minute walk after meals'
        ],
        expectedBenefit: 'Improved cardiovascular health and energy levels',
        timeToSeeResults: '2-4 weeks',
        basedOn: ['Activity tracking', 'Health goals', 'Risk assessment']
      },
      {
        id: '2',
        category: 'diet',
        title: 'Increase Omega-3 Intake',
        description: 'Your diet analysis suggests you could benefit from more omega-3 fatty acids',
        priority: 'medium',
        actionItems: [
          'Include fish in your diet 2-3 times per week',
          'Add walnuts or flaxseeds to your breakfast',
          'Consider an omega-3 supplement after consulting your doctor'
        ],
        expectedBenefit: 'Better heart health and reduced inflammation',
        timeToSeeResults: '4-6 weeks',
        basedOn: ['Dietary analysis', 'Health records', 'Lab results']
      },
      {
        id: '3',
        category: 'preventive',
        title: 'Schedule Annual Eye Exam',
        description: 'It\'s been over a year since your last eye examination',
        priority: 'medium',
        actionItems: [
          'Schedule appointment with ophthalmologist',
          'Prepare list of any vision changes',
          'Bring current glasses/contacts for evaluation'
        ],
        expectedBenefit: 'Early detection of vision problems',
        timeToSeeResults: 'Immediate',
        basedOn: ['Appointment history', 'Age-based recommendations']
      }
    ];

    setRecommendations(mockRecommendations);
    return mockRecommendations;
  };

  const markRecommendationCompleted = (id: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
  };

  const getSchedulingSuggestions = async (): Promise<SmartSchedulingSuggestion[]> => {
    const mockSuggestions: SmartSchedulingSuggestion[] = [
      {
        id: '1',
        doctorName: 'Dr. Sarah Johnson',
        specialty: 'Primary Care',
        appointmentType: 'in-person',
        recommendedDate: '2024-01-15',
        recommendedTime: '10:00 AM',
        location: 'Main Medical Center',
        urgency: 'medium',
        matchScore: 95,
        rating: 4.8,
        estimatedWaitTime: '5-10 minutes',
        reasonForRecommendation: 'It\'s been 11 months since your last physical exam',
        availableSlots: 3,
        insuranceAccepted: true,
        suggestedTiming: 'Next 2 weeks',
        reasoning: 'It\'s been 11 months since your last physical exam',
        priority: 'recommended',
        doctorSpecialty: 'Primary Care',
        estimatedDuration: '45 minutes'
      },
      {
        id: '2',
        doctorName: 'Dr. Michael Chen',
        specialty: 'Primary Care',
        appointmentType: 'in-person',
        recommendedDate: '2024-01-10',
        recommendedTime: '2:00 PM',
        location: 'Downtown Clinic',
        urgency: 'high',
        matchScore: 88,
        rating: 4.6,
        estimatedWaitTime: '10-15 minutes',
        reasonForRecommendation: 'Your recent symptoms and medication changes warrant blood work monitoring',
        availableSlots: 2,
        insuranceAccepted: true,
        suggestedTiming: 'This week',
        reasoning: 'Your recent symptoms and medication changes warrant blood work monitoring',
        priority: 'urgent',
        doctorSpecialty: 'Primary Care',
        estimatedDuration: '15 minutes'
      },
      {
        id: '3',
        doctorName: 'Dr. Emily Rodriguez',
        specialty: 'Dermatology',
        appointmentType: 'in-person',
        recommendedDate: '2024-02-01',
        recommendedTime: '11:30 AM',
        location: 'Skin Care Specialists',
        urgency: 'low',
        matchScore: 82,
        rating: 4.9,
        estimatedWaitTime: '15-20 minutes',
        reasonForRecommendation: 'Annual skin cancer screening recommended for your age group',
        availableSlots: 5,
        insuranceAccepted: true,
        suggestedTiming: 'Next month',
        reasoning: 'Annual skin cancer screening recommended for your age group',
        priority: 'routine',
        doctorSpecialty: 'Dermatology',
        estimatedDuration: '30 minutes'
      }
    ];

    setSchedulingSuggestions(mockSuggestions);
    return mockSuggestions;
  };

  const getSmartSchedulingSuggestions = async (): Promise<SmartSchedulingSuggestion[]> => {
    return getSchedulingSuggestions();
  };

  const askHealthQuestion = async (question: string): Promise<string> => {
    // Mock AI health question answering
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = {
      'headache': 'Headaches can have many causes including stress, dehydration, lack of sleep, or underlying medical conditions. If headaches are frequent or severe, consider consulting a healthcare provider.',
      'fever': 'A fever is your body\'s natural response to infection. Stay hydrated, rest, and monitor your temperature. Seek medical attention if fever exceeds 103°F (39.4°C) or persists for more than 3 days.',
      'fatigue': 'Fatigue can result from poor sleep, stress, medical conditions, or lifestyle factors. Ensure adequate sleep, regular exercise, and a balanced diet. Persistent fatigue warrants medical evaluation.',
      'default': 'I understand your concern about your health. While I can provide general information, it\'s important to consult with a healthcare professional for personalized medical advice, especially if symptoms persist or worsen.'
    };

    const lowerQuestion = question.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerQuestion.includes(key)) {
        return response;
      }
    }
    
    return responses.default;
  };

  const value = {
    analyzeSymptoms,
    getSymptomHistory,
    assessHealthRisks,
    getHealthRiskTrends,
    getPersonalizedRecommendations,
    markRecommendationCompleted,
    getSchedulingSuggestions,
    getSmartSchedulingSuggestions,
    askHealthQuestion,
    isAnalyzing,
    lastAnalysis,
    healthRisks,
    recommendations,
    schedulingSuggestions,
  };

  return (
    <AIHealthContext.Provider value={value}>
      {children}
    </AIHealthContext.Provider>
  );
};

export { 
  type Symptom, 
  type SymptomAnalysis, 
  type HealthRisk, 
  type PersonalizedRecommendation, 
  type HealthRecommendation, 
  type SmartSchedulingSuggestion 
};
