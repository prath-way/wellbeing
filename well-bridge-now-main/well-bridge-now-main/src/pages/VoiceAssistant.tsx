import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, MessageCircle, Stethoscope, Pill, Heart } from 'lucide-react';
import { useVoiceHealth } from '@/contexts/VoiceHealthContext';
import ConversationalAI from '@/components/ConversationalAI';
import VoiceSymptomReporter from '@/components/VoiceSymptomReporter';
import VoiceMedicationReminders from '@/components/VoiceMedicationReminders';
import VoiceHealthCoaching from '@/components/VoiceHealthCoaching';

const VoiceAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const { isListening, isSpeaking, stopSpeaking } = useVoiceHealth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 dark:bg-blue-500 p-3 rounded-full shadow-lg">
              <Mic className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Voice Health Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Speak naturally to get health insights, report symptoms, and manage your wellness journey
          </p>
        </div>

        {/* Voice Status Indicator */}
        {(isListening || isSpeaking) && (
          <div className="mt-6 flex justify-center">
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg p-4 flex items-center gap-3">
              {isListening && (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">I'm listening...</span>
                </>
              )}
              {isSpeaking && (
                <>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Speaking...</span>
                  <button
                    onClick={stopSpeaking}
                    className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white text-xs rounded-full transition-colors"
                  >
                    Stop
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-white dark:bg-gray-800 border dark:border-gray-700">
          <TabsTrigger 
            value="chat" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 dark:text-gray-300 dark:data-[state=active]:text-white"
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger 
            value="symptoms" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 dark:text-gray-300 dark:data-[state=active]:text-white"
          >
            <Stethoscope className="w-4 h-4" />
            Symptoms
          </TabsTrigger>
          <TabsTrigger 
            value="medications" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 dark:text-gray-300 dark:data-[state=active]:text-white"
          >
            <Pill className="w-4 h-4" />
            Medications
          </TabsTrigger>
          <TabsTrigger 
            value="coaching" 
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-500 dark:text-gray-300 dark:data-[state=active]:text-white"
          >
            <Heart className="w-4 h-4" />
            Coaching
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <ConversationalAI />
        </TabsContent>

        {/* Symptoms Tab */}
        <TabsContent value="symptoms" className="space-y-6">
          <VoiceSymptomReporter />
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="space-y-6">
          <VoiceMedicationReminders />
        </TabsContent>

        {/* Coaching Tab */}
        <TabsContent value="coaching" className="space-y-6">
          <VoiceHealthCoaching />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VoiceAssistant;
