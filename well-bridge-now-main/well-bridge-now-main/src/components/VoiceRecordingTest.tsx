import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useVoiceHealth } from '@/contexts/VoiceHealthContext';
import { Mic, MicOff, Volume2, VolumeX, AlertCircle, CheckCircle } from 'lucide-react';

const VoiceRecordingTest = () => {
  const {
    isListening,
    startListening,
    stopListening,
    transcript,
    confidence,
    speak,
    stopSpeaking,
    isSpeaking
  } = useVoiceHealth();

  const [browserSupport, setBrowserSupport] = useState({
    speechRecognition: false,
    speechSynthesis: false
  });

  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');

  useEffect(() => {
    // Check browser support
    const speechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const speechSynthesisSupported = 'speechSynthesis' in window;
    
    setBrowserSupport({
      speechRecognition: speechRecognitionSupported,
      speechSynthesis: speechSynthesisSupported
    });

    // Check microphone permission
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then(result => {
          setPermissionStatus(result.state as 'granted' | 'denied');
          result.onchange = () => {
            setPermissionStatus(result.state as 'granted' | 'denied');
          };
        })
        .catch(() => {
          setPermissionStatus('unknown');
        });
    }
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionStatus('granted');
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setPermissionStatus('denied');
    }
  };

  const testSpeechSynthesis = () => {
    speak("This is a test of the speech synthesis functionality. If you can hear this, speech synthesis is working correctly.");
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Voice Recording Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Browser Support Status */}
          <div className="space-y-2">
            <h4 className="font-medium">Browser Support:</h4>
            <div className="flex gap-2">
              <Badge variant={browserSupport.speechRecognition ? "default" : "destructive"}>
                {browserSupport.speechRecognition ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                Speech Recognition {browserSupport.speechRecognition ? 'Supported' : 'Not Supported'}
              </Badge>
              <Badge variant={browserSupport.speechSynthesis ? "default" : "destructive"}>
                {browserSupport.speechSynthesis ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                Speech Synthesis {browserSupport.speechSynthesis ? 'Supported' : 'Not Supported'}
              </Badge>
            </div>
          </div>

          {/* Permission Status */}
          <div className="space-y-2">
            <h4 className="font-medium">Microphone Permission:</h4>
            <div className="flex items-center gap-2">
              <Badge variant={
                permissionStatus === 'granted' ? 'default' : 
                permissionStatus === 'denied' ? 'destructive' : 'outline'
              }>
                {permissionStatus === 'granted' && <CheckCircle className="w-3 h-3 mr-1" />}
                {permissionStatus === 'denied' && <AlertCircle className="w-3 h-3 mr-1" />}
                {permissionStatus === 'unknown' && <AlertCircle className="w-3 h-3 mr-1" />}
                {permissionStatus === 'granted' ? 'Granted' : 
                 permissionStatus === 'denied' ? 'Denied' : 'Unknown'}
              </Badge>
              {permissionStatus !== 'granted' && (
                <Button size="sm" onClick={requestMicrophonePermission}>
                  Request Permission
                </Button>
              )}
            </div>
          </div>

          {/* Mobile-Optimized Voice Recording Controls */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <div className="relative">
                <Button
                  size="lg"
                  variant={isListening ? "destructive" : "default"}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg hover:scale-105 transition-all duration-300 touch-manipulation ${
                    isListening ? 'animate-pulse bg-red-500 hover:bg-red-600' : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                  }`}
                  onClick={handleVoiceToggle}
                  disabled={!browserSupport.speechRecognition || permissionStatus === 'denied'}
                >
                  {isListening ? <MicOff className="w-6 h-6 sm:w-8 sm:h-8 text-white" /> : <Mic className="w-6 h-6 sm:w-8 sm:h-8 text-white" />}
                </Button>
                {isListening && (
                  <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-red-300 rounded-full animate-ping"></div>
                )}
              </div>
              
              <Button
                variant="outline"
                size="lg"
                className="border-2 hover:scale-105 transition-all duration-200 min-w-[120px] touch-manipulation"
                onClick={isSpeaking ? stopSpeaking : testSpeechSynthesis}
                disabled={!browserSupport.speechSynthesis}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                <span className="ml-2 text-sm sm:text-base">{isSpeaking ? 'Stop Audio' : 'Test Speech'}</span>
              </Button>
            </div>

            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 md:p-4 mx-2 sm:mx-0">
              <p className="font-semibold text-base sm:text-lg">
                {isListening ? (
                  <span className="text-red-600 flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    Listening... Speak clearly now!
                  </span>
                ) : (
                  <span className="text-slate-700">Tap the microphone to start voice recording</span>
                )}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {isListening ? 'Your voice is being processed in real-time' : 'Make sure your microphone is enabled'}
              </p>
            </div>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="space-y-2">
              <h4 className="font-medium">Transcript:</h4>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">{transcript}</p>
                {confidence > 0 && (
                  <div className="mt-2">
                    <Badge variant="outline">
                      Confidence: {Math.round(confidence * 100)}%
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Troubleshooting Tips */}
          <div className="space-y-2">
            <h4 className="font-medium">Troubleshooting Tips:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Make sure your microphone is connected and working</li>
              <li>• Check that microphone permissions are granted for this website</li>
              <li>• Try refreshing the page if recording doesn't work</li>
              <li>• Speak clearly and close to your microphone</li>
              <li>• Check browser console for any error messages</li>
              <li>• This feature works best in Chrome, Edge, and Safari</li>
            </ul>
          </div>

          {/* Browser Compatibility Note */}
          {(!browserSupport.speechRecognition || !browserSupport.speechSynthesis) && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-900">Browser Compatibility Issue</p>
                  <p className="text-yellow-800">
                    Your browser doesn't fully support the Web Speech API. 
                    For the best experience, please use Chrome, Edge, or Safari.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceRecordingTest;
