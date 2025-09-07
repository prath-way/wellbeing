import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVoiceHealth, type VoiceCoachingSession } from '@/contexts/VoiceHealthContext';
import { 
  Brain, 
  Play, 
  Square,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Target,
  TrendingUp,
  Heart,
  Activity,
  Apple,
  Moon,
  Zap,
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';

const VoiceHealthCoaching = () => {
  const {
    coachingSessions,
    startVoiceCoaching,
    isListening,
    isProcessing,
    startListening,
    stopListening,
    transcript,
    speak,
    stopSpeaking,
    isSpeaking,
    sendVoiceMessage,
    currentSession,
    startNewSession,
    endCurrentSession
  } = useVoiceHealth();

  const [selectedTopic, setSelectedTopic] = useState('');
  const [isCoachingActive, setIsCoachingActive] = useState(false);
  const [currentCoachingSession, setCurrentCoachingSession] = useState<VoiceCoachingSession | null>(null);

  const coachingTopics = [
    { id: 'exercise', label: 'Exercise & Fitness', icon: Activity, color: 'text-blue-600', description: 'Build a sustainable fitness routine' },
    { id: 'nutrition', label: 'Nutrition & Diet', icon: Apple, color: 'text-green-600', description: 'Improve your eating habits' },
    { id: 'sleep', label: 'Sleep Quality', icon: Moon, color: 'text-purple-600', description: 'Optimize your sleep patterns' },
    { id: 'stress', label: 'Stress Management', icon: Brain, color: 'text-orange-600', description: 'Learn stress reduction techniques' },
    { id: 'weight', label: 'Weight Management', icon: Target, color: 'text-red-600', description: 'Achieve healthy weight goals' },
    { id: 'heart', label: 'Heart Health', icon: Heart, color: 'text-pink-600', description: 'Improve cardiovascular wellness' }
  ];

  const handleStartCoaching = async (topic: string) => {
    setSelectedTopic(topic);
    setIsCoachingActive(true);
    
    // Start a coaching conversation session
    startNewSession('coaching');
    
    // Create a coaching session record
    const session = await startVoiceCoaching(topic);
    setCurrentCoachingSession(session);
    
    const topicData = coachingTopics.find(t => t.id === topic);
    const welcomeMessage = `Welcome to your ${topicData?.label} coaching session! I'm here to help you ${topicData?.description}. Let's start by discussing your current situation and goals. What would you like to focus on today?`;
    
    speak(welcomeMessage);
  };

  const handleEndCoaching = () => {
    setIsCoachingActive(false);
    setCurrentCoachingSession(null);
    endCurrentSession();
    speak("Great session! Remember, consistency is key to achieving your health goals. Keep up the good work!");
  };

  const handleVoiceInput = async () => {
    if (isListening) {
      stopListening();
      if (transcript.trim() && currentSession) {
        await sendVoiceMessage(transcript);
      }
    } else {
      if (isSpeaking) {
        stopSpeaking();
      }
      startListening();
    }
  };

  const getTopicIcon = (topicId: string) => {
    const topic = coachingTopics.find(t => t.id === topicId);
    return topic?.icon || Brain;
  };

  const getSessionDuration = (session: VoiceCoachingSession) => {
    const start = new Date(session.timestamp);
    const now = new Date();
    return Math.round((now.getTime() - start.getTime()) / 60000); // minutes
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">Voice Health Coaching</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get personalized health coaching through natural voice conversations. 
          Set goals, track progress, and receive expert guidance tailored to your needs.
        </p>
      </div>

      {/* Active Coaching Session */}
      {isCoachingActive && currentCoachingSession && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {(() => {
                  const Icon = getTopicIcon(currentCoachingSession.topic);
                  return <Icon className="w-5 h-5" />;
                })()}
                {coachingTopics.find(t => t.id === currentCoachingSession.topic)?.label} Session
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {getSessionDuration(currentCoachingSession)} min
                </Badge>
                <Button variant="outline" size="sm" onClick={handleEndCoaching}>
                  End Session
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Voice Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                variant={isListening ? "destructive" : "default"}
                className={`w-16 h-16 rounded-full ${isListening ? 'animate-pulse' : ''}`}
                onClick={handleVoiceInput}
                disabled={isProcessing}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
              
              <Button
                variant="outline"
                onClick={isSpeaking ? stopSpeaking : () => speak("I'm here to help with your health coaching session.")}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isSpeaking ? 'Stop' : 'Speak'}
              </Button>
            </div>

            <div className="text-center">
              <p className="font-medium">
                {isListening ? 'Listening to your response...' : 
                 isProcessing ? 'Processing your input...' :
                 'Tap the microphone to speak'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Share your thoughts, challenges, and goals
              </p>
            </div>

            {/* Live Transcript */}
            {(transcript || isListening) && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  {transcript || "Listening..."}
                  {isListening && <span className="animate-pulse">|</span>}
                </p>
              </div>
            )}

            {/* Session Insights */}
            {currentCoachingSession.insights.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Key Insights:</h4>
                <ul className="space-y-1">
                  {currentCoachingSession.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {currentCoachingSession.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Personalized Recommendations:</h4>
                <ul className="space-y-1">
                  {currentCoachingSession.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Coaching Topics */}
      {!isCoachingActive && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Coaching Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coachingTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <Button
                    key={topic.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center gap-3"
                    onClick={() => handleStartCoaching(topic.id)}
                  >
                    <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${topic.color}`} />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{topic.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {topic.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Coaching Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Coaching Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {coachingSessions.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No coaching sessions yet. Start your first session above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {coachingSessions.slice(0, 5).map((session) => {
                const Icon = getTopicIcon(session.topic);
                const topicData = coachingTopics.find(t => t.id === session.topic);
                
                return (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{topicData?.label}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.timestamp).toLocaleDateString()} • {session.duration} min
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {session.insights.length} insights
                      </Badge>
                    </div>

                    {session.insights.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Key Insights:</h5>
                        <div className="space-y-1">
                          {session.insights.slice(0, 2).map((insight, index) => (
                            <p key={index} className="text-sm text-muted-foreground">
                              • {insight}
                            </p>
                          ))}
                          {session.insights.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{session.insights.length - 2} more insights
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {session.recommendations.length > 0 && (
                      <div className="space-y-2 mt-3">
                        <h5 className="text-sm font-medium">Recommendations:</h5>
                        <div className="space-y-1">
                          {session.recommendations.slice(0, 2).map((rec, index) => (
                            <p key={index} className="text-sm text-muted-foreground">
                              • {rec}
                            </p>
                          ))}
                          {session.recommendations.length > 2 && (
                            <p className="text-xs text-muted-foreground">
                              +{session.recommendations.length - 2} more recommendations
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coaching Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Coaching Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Getting the Most from Voice Coaching:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Be honest about your current habits and challenges
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Set specific, measurable goals
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Ask questions about strategies and techniques
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Share your progress and setbacks openly
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Sample Questions to Ask:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>"What's a realistic exercise routine for a beginner?"</li>
                <li>"How can I improve my sleep quality?"</li>
                <li>"What are healthy snack alternatives?"</li>
                <li>"How do I stay motivated when progress is slow?"</li>
                <li>"What stress management techniques work best?"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceHealthCoaching;
