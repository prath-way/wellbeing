import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useVoiceHealth, type VoiceSymptomReport } from '@/contexts/VoiceHealthContext';
import { useAIHealth } from '@/contexts/AIHealthContext';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Play,
  Square,
  FileText,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

const VoiceSymptomReporter = () => {
  const { 
    isListening, 
    isProcessing, 
    startListening, 
    stopListening, 
    transcript, 
    confidence,
    voiceSymptomReports,
    reportSymptomsViaVoice,
    speak,
    stopSpeaking,
    isSpeaking,
    voiceSettings
  } = useVoiceHealth();
  
  const { analyzeSymptoms } = useAIHealth();
  const [currentReport, setCurrentReport] = useState<VoiceSymptomReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartRecording = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    startListening();
    speak("I'm listening. Please describe your symptoms in detail.");
  };

  const handleStopRecording = async () => {
    stopListening();
    
    if (transcript.trim()) {
      setIsAnalyzing(true);
      try {
        const report = await reportSymptomsViaVoice(transcript);
        setCurrentReport(report);
        
        // Convert voice report to symptom analysis format
        const symptoms = report.symptoms.map(symptom => ({
          id: Date.now().toString() + Math.random(),
          name: symptom,
          severity: report.severity as 'mild' | 'moderate' | 'severe',
          duration: report.duration,
          frequency: 'occasional' as const,
          description: report.transcript,
          associatedSymptoms: []
        }));

        if (symptoms.length > 0) {
          await analyzeSymptoms(symptoms);
        }

        speak(`I've recorded your symptoms: ${report.symptoms.join(', ')}. Let me analyze this for you.`);
      } catch (error) {
        console.error('Error processing voice symptoms:', error);
        speak("I'm sorry, I had trouble processing your symptoms. Please try again.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.8) return 'text-green-600';
    if (conf >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Mic className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">Voice Symptom Reporter</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Use your voice to report symptoms naturally. I'll listen, understand, and help analyze your health concerns.
        </p>
      </div>

      {/* Voice Recording Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Voice Recording
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* Responsive Recording Controls */}
          <div className="flex flex-col items-center space-y-3 md:space-y-4">
            <div className="relative">
              <Button
                size="lg"
                variant={isListening ? "destructive" : "default"}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full touch-manipulation ${isListening ? 'animate-pulse' : ''}`}
                onClick={isListening ? handleStopRecording : handleStartRecording}
                disabled={isProcessing || isAnalyzing}
              >
                {isListening ? (
                  <MicOff className="w-6 h-6 sm:w-8 sm:h-8" />
                ) : (
                  <Mic className="w-6 h-6 sm:w-8 sm:h-8" />
                )}
              </Button>
              
              {isListening && (
                <div className="absolute -inset-2 border-2 border-primary rounded-full animate-ping"></div>
              )}
            </div>

            <div className="text-center px-4">
              <p className="font-medium text-sm sm:text-base">
                {isListening ? 'Listening...' : 
                 isProcessing ? 'Processing...' : 
                 isAnalyzing ? 'Analyzing symptoms...' :
                 'Tap to start recording'}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Speak clearly about your symptoms, their severity, and duration
              </p>
            </div>

            {/* Enhanced Live Transcript */}
            {(transcript || isListening) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg">Live Transcript</h4>
                  {confidence > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Confidence:</span>
                      <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
                        {Math.round(confidence * 100)}%
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-100">
                  <p className="text-sm leading-relaxed">
                    {transcript || (isListening ? "🎤 Listening for your voice..." : "")}
                    {isListening && <span className="animate-pulse text-red-500 ml-1">●</span>}
                  </p>
                </div>

                {confidence > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Speech Recognition Quality</span>
                      <span className={getConfidenceColor(confidence)}>{Math.round(confidence * 100)}%</span>
                    </div>
                    <Progress value={confidence * 100} className="h-3" />
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Report */}
      {currentReport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Latest Voice Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{currentReport.symptoms.length}</div>
                <p className="text-sm text-muted-foreground">Symptoms Detected</p>
              </div>
              <div className="text-center">
                <Badge className={getSeverityColor(currentReport.severity)}>
                  {currentReport.severity.toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Severity Level</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium">{currentReport.duration}</div>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Detected Symptoms:</h4>
              <div className="flex flex-wrap gap-2">
                {currentReport.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Full Transcript:</h4>
              <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                "{currentReport.transcript}"
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Recorded: {new Date(currentReport.timestamp).toLocaleString()}</span>
              <span className={getConfidenceColor(currentReport.confidence)}>
                {Math.round(currentReport.confidence * 100)}% confidence
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Voice Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {voiceSymptomReports.length === 0 ? (
            <div className="text-center py-8">
              <Mic className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No voice reports yet. Start by recording your symptoms above.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {voiceSymptomReports.slice(0, 5).map((report) => (
                <div key={report.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(report.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <Badge className={getSeverityColor(report.severity)}>
                      {report.severity}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {report.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      "{report.transcript}"
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Duration: {report.duration}</span>
                      <span className={getConfidenceColor(report.confidence)}>
                        {Math.round(report.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips for Better Voice Recognition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Tips for Better Voice Recognition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Speaking Tips:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Speak clearly and at a normal pace
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Use specific symptom names when possible
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Mention severity (mild, moderate, severe)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Include duration (hours, days, weeks)
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Environment:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  Find a quiet space with minimal background noise
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  Ensure your microphone has permission
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  Speak 6-12 inches from your device
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  Check your internet connection
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceSymptomReporter;
