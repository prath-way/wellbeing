import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useVoiceHealth, type VoiceMessage, type VoiceSession } from '@/contexts/VoiceHealthContext';
import { 
  MessageCircle, 
  Mic, 
  MicOff, 
  Send,
  Volume2,
  VolumeX,
  Plus,
  Clock,
  User,
  Bot,
  Stethoscope,
  Pill,
  Heart,
  Brain
} from 'lucide-react';

const ConversationalAI = () => {
  const {
    currentSession,
    sessionHistory,
    sendVoiceMessage,
    startNewSession,
    endCurrentSession,
    isListening,
    isProcessing,
    startListening,
    stopListening,
    transcript,
    speak,
    stopSpeaking,
    isSpeaking,
    voiceSettings
  } = useVoiceHealth();

  const [textInput, setTextInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VoiceSession['category']>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'general' as const, label: 'General Health', icon: Heart, color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
    { id: 'symptom-check' as const, label: 'Symptom Check', icon: Stethoscope, color: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
    { id: 'medication' as const, label: 'Medications', icon: Pill, color: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    { id: 'coaching' as const, label: 'Health Coaching', icon: Brain, color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  useEffect(() => {
    if (transcript && isListening) {
      // Auto-send when user stops speaking (after a pause)
      const timer = setTimeout(() => {
        if (transcript.trim()) {
          handleSendMessage(transcript);
          stopListening();
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [transcript, isListening]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartNewSession = (category: VoiceSession['category']) => {
    setSelectedCategory(category);
    startNewSession(category);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !currentSession) return;

    await sendVoiceMessage(message);
    setTextInput('');
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
      if (transcript.trim()) {
        handleSendMessage(transcript);
      }
    } else {
      if (isSpeaking) {
        stopSpeaking();
      }
      startListening();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(textInput);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <MessageCircle className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">AI Health Companion</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have natural conversations about your health. Ask questions, report symptoms, 
          get medication help, or receive personalized health coaching.
        </p>
      </div>

      {/* Session Categories */}
      {!currentSession && (
        <Card>
          <CardHeader>
            <CardTitle>Start a Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-3"
                    onClick={() => handleStartNewSession(category.id)}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{category.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {category.id === 'general' && 'Ask any health-related questions'}
                        {category.id === 'symptom-check' && 'Report and analyze symptoms'}
                        {category.id === 'medication' && 'Get help with medications'}
                        {category.id === 'coaching' && 'Personalized health guidance'}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Conversation */}
      {currentSession && (
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const category = categories.find(c => c.id === currentSession.category);
                  const Icon = category?.icon || MessageCircle;
                  return (
                    <>
                      <Icon className="w-5 h-5" />
                      {category?.label || 'Conversation'}
                    </>
                  );
                })()}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {currentSession.messages.length} messages
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={endCurrentSession}
                >
                  End Session
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentSession.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.type === 'assistant' && (
                          <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        {message.type === 'user' && (
                          <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {formatMessageTime(message.timestamp)}
                            </span>
                            {message.confidence && (
                              <span className="text-xs opacity-70">
                                {Math.round(message.confidence * 100)}% confidence
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4 space-y-3">
              {/* Voice Transcript Display */}
              {(isListening || transcript) && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {isListening ? 'Listening...' : 'Voice Input'}
                    </span>
                  </div>
                  <p className="text-sm text-blue-800">
                    {transcript || "Speak now..."}
                    {isListening && <span className="animate-pulse">|</span>}
                  </p>
                </div>
              )}

              {/* Input Controls */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message or use voice input..."
                    disabled={isProcessing || isListening}
                  />
                </div>
                
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleVoiceInput}
                  disabled={isProcessing}
                  className={isListening ? 'animate-pulse' : ''}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isSpeaking ? stopSpeaking : () => speak("Voice assistant is ready to help.")}
                  disabled={isProcessing}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                
                <Button
                  onClick={() => handleSendMessage(textInput)}
                  disabled={!textInput.trim() || isProcessing}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Press Enter to send • Hold Mic to speak</span>
                <span>Auto-speak: {voiceSettings.autoSpeak ? 'On' : 'Off'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Session History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Conversations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessionHistory.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No conversation history yet. Start your first conversation above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessionHistory.slice(0, 5).map((session) => {
                const category = categories.find(c => c.id === session.category);
                const Icon = category?.icon || MessageCircle;
                
                return (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{category?.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {session.messages.length} messages
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(session.startTime).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {session.messages.length > 0 && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {session.messages[session.messages.length - 1]?.content}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                      <span>
                        Duration: {session.endTime 
                          ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000) + ' min'
                          : 'Ongoing'
                        }
                      </span>
                      <Button variant="ghost" size="sm" className="h-auto p-1">
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {!currentSession && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleStartNewSession('symptom-check')}
              >
                <Stethoscope className="w-6 h-6 text-red-600" />
                <div className="text-center">
                  <div className="font-medium">Report Symptoms</div>
                  <div className="text-sm text-muted-foreground">Quick symptom check</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleStartNewSession('medication')}
              >
                <Pill className="w-6 h-6 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">Medication Help</div>
                  <div className="text-sm text-muted-foreground">Reminders & questions</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => handleStartNewSession('coaching')}
              >
                <Brain className="w-6 h-6 text-purple-600" />
                <div className="text-center">
                  <div className="font-medium">Health Coaching</div>
                  <div className="text-sm text-muted-foreground">Personalized guidance</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConversationalAI;
