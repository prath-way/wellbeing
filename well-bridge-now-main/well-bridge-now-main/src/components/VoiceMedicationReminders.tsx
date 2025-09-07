import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useVoiceHealth, type VoiceMedicationReminder } from '@/contexts/VoiceHealthContext';
import { useMedications } from '@/contexts/MedicationContext';
import { 
  Pill, 
  Clock, 
  Volume2, 
  VolumeX,
  Plus,
  Check,
  X,
  Bell,
  Mic,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const VoiceMedicationReminders = () => {
  const {
    voiceMedicationReminders,
    setVoiceMedicationReminder,
    acknowledgeVoiceReminder,
    speak,
    stopSpeaking,
    isSpeaking,
    voiceSettings
  } = useVoiceHealth();

  const { medications } = useMedications();
  
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({
    medicationName: '',
    dosage: '',
    time: '',
    frequency: 'daily',
    voiceEnabled: true
  });

  // Check for due reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
      
      voiceMedicationReminders.forEach(reminder => {
        if (
          reminder.voiceEnabled && 
          reminder.time === currentTime && 
          !reminder.acknowledged &&
          (!reminder.lastReminded || 
           new Date(reminder.lastReminded).toDateString() !== now.toDateString())
        ) {
          playVoiceReminder(reminder);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [voiceMedicationReminders]);

  const playVoiceReminder = (reminder: VoiceMedicationReminder) => {
    const message = `It's time for your medication. Please take ${reminder.dosage} of ${reminder.medicationName}.`;
    speak(message);
    
    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Medication Reminder', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  };

  const handleAddReminder = () => {
    if (newReminder.medicationName && newReminder.dosage && newReminder.time) {
      setVoiceMedicationReminder(newReminder);
      setNewReminder({
        medicationName: '',
        dosage: '',
        time: '',
        frequency: 'daily',
        voiceEnabled: true
      });
      setIsAddingReminder(false);
      
      speak(`Voice reminder set for ${newReminder.medicationName} at ${newReminder.time}`);
    }
  };

  const handleAcknowledge = (id: string) => {
    acknowledgeVoiceReminder(id);
    speak("Medication reminder acknowledged.");
  };

  const testVoiceReminder = (reminder: VoiceMedicationReminder) => {
    playVoiceReminder(reminder);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    return voiceMedicationReminders
      .filter(reminder => reminder.voiceEnabled)
      .map(reminder => {
        const [hours, minutes] = reminder.time.split(':').map(Number);
        const reminderTime = hours * 60 + minutes;
        const timeDiff = reminderTime - currentTime;
        
        return {
          ...reminder,
          minutesUntil: timeDiff >= 0 ? timeDiff : timeDiff + 24 * 60 // Next day if negative
        };
      })
      .sort((a, b) => a.minutesUntil - b.minutesUntil);
  };

  const formatTimeUntil = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Bell className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">Voice Medication Reminders</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Set up voice-activated medication reminders that speak to you when it's time to take your medications.
        </p>
      </div>

      {/* Notification Permission */}
      {'Notification' in window && Notification.permission === 'default' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-900">Enable Notifications</h4>
                <p className="text-sm text-yellow-800">
                  Allow notifications to receive medication reminders even when the app is not active.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={requestNotificationPermission}>
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Upcoming Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getUpcomingReminders().length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No voice reminders set up yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getUpcomingReminders().slice(0, 5).map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Pill className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{reminder.medicationName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {reminder.dosage} • {reminder.time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      in {formatTimeUntil(reminder.minutesUntil)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => testVoiceReminder(reminder)}
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Reminder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Voice Reminders</CardTitle>
            <Button onClick={() => setIsAddingReminder(true)} disabled={isAddingReminder}>
              <Plus className="w-4 h-4 mr-2" />
              Add Reminder
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAddingReminder && (
            <div className="p-4 border rounded-lg space-y-4">
              <h4 className="font-medium">New Voice Reminder</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Medication</Label>
                  <Select 
                    value={newReminder.medicationName}
                    onValueChange={(value) => setNewReminder(prev => ({ ...prev, medicationName: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select medication" />
                    </SelectTrigger>
                    <SelectContent>
                      {medications.map(med => (
                        <SelectItem key={med.id} value={med.name}>
                          {med.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom medication...</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {newReminder.medicationName === 'custom' && (
                    <Input
                      placeholder="Enter medication name"
                      onChange={(e) => setNewReminder(prev => ({ ...prev, medicationName: e.target.value }))}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Dosage</Label>
                  <Input
                    value={newReminder.dosage}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, dosage: e.target.value }))}
                    placeholder="e.g., 1 tablet, 5ml"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select 
                    value={newReminder.frequency}
                    onValueChange={(value) => setNewReminder(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="as-needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newReminder.voiceEnabled}
                  onCheckedChange={(checked) => setNewReminder(prev => ({ ...prev, voiceEnabled: checked }))}
                />
                <Label>Enable voice announcements</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddReminder}>
                  <Check className="w-4 h-4 mr-2" />
                  Add Reminder
                </Button>
                <Button variant="outline" onClick={() => setIsAddingReminder(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Existing Reminders */}
          <div className="space-y-3">
            {voiceMedicationReminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Pill className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{reminder.medicationName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {reminder.dosage} • {reminder.time} • {reminder.frequency}
                    </p>
                    {reminder.lastReminded && (
                      <p className="text-xs text-muted-foreground">
                        Last reminded: {new Date(reminder.lastReminded).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {reminder.voiceEnabled ? (
                    <Badge variant="default">
                      <Mic className="w-3 h-3 mr-1" />
                      Voice On
                    </Badge>
                  ) : (
                    <Badge variant="outline">Voice Off</Badge>
                  )}
                  
                  {reminder.acknowledged && (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Taken
                    </Badge>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => testVoiceReminder(reminder)}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                  
                  {!reminder.acknowledged && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcknowledge(reminder.id)}
                    >
                      Mark Taken
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Voice Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Voice Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Voice Speed</Label>
              <Select value={voiceSettings.voiceSpeed.toString()}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">Slow</SelectItem>
                  <SelectItem value="1.0">Normal</SelectItem>
                  <SelectItem value="1.5">Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={voiceSettings.language}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="en-GB">English (UK)</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-speak reminders</Label>
              <p className="text-sm text-muted-foreground">
                Automatically announce medication reminders
              </p>
            </div>
            <Switch checked={voiceSettings.autoSpeak} />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={isSpeaking ? stopSpeaking : () => speak("This is a test of your voice reminder settings.")}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
              {isSpeaking ? 'Stop Test' : 'Test Voice'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceMedicationReminders;
