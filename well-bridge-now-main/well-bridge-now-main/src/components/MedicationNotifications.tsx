import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMedications } from '@/contexts/MedicationContext';
import { Bell, BellOff, Clock, Smartphone, Mail, MessageSquare } from 'lucide-react';

interface NotificationSettings {
  enabled: boolean;
  methods: {
    browser: boolean;
    email: boolean;
    sms: boolean;
  };
  timing: {
    beforeDose: number; // minutes before
    missedDose: number; // minutes after
    refillReminder: number; // days before running out
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const MedicationNotifications = () => {
  const { medications, getTodaysReminders, getUpcomingReminders } = useMedications();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    methods: {
      browser: true,
      email: false,
      sms: false
    },
    timing: {
      beforeDose: 15,
      missedDose: 30,
      refillReminder: 3
    },
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '07:00'
    }
  });

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('medication-notifications');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('medication-notifications', JSON.stringify(settings));
    
    // Set up notification scheduling if enabled
    if (settings.enabled && notificationPermission === 'granted') {
      scheduleNotifications();
    }
  }, [settings, notificationPermission]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const scheduleNotifications = () => {
    // Clear existing notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications().then(notifications => {
          notifications.forEach(notification => notification.close());
        });
      });
    }

    const upcomingReminders = getUpcomingReminders();
    
    upcomingReminders.forEach(reminder => {
      const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
      const notificationTime = new Date(reminderTime.getTime() - (settings.timing.beforeDose * 60000));
      const now = new Date();

      if (notificationTime > now && !isQuietHours(notificationTime)) {
        const timeUntilNotification = notificationTime.getTime() - now.getTime();
        
        setTimeout(() => {
          showNotification(reminder);
        }, timeUntilNotification);
      }
    });
  };

  const isQuietHours = (time: Date): boolean => {
    if (!settings.quietHours.enabled) return false;
    
    const timeStr = time.toTimeString().slice(0, 5);
    const start = settings.quietHours.start;
    const end = settings.quietHours.end;
    
    if (start <= end) {
      return timeStr >= start && timeStr <= end;
    } else {
      return timeStr >= start || timeStr <= end;
    }
  };

  const showNotification = (reminder: any) => {
    if (!settings.enabled || notificationPermission !== 'granted') return;

    const options: NotificationOptions = {
      body: `Time to take ${reminder.dosage} of ${reminder.medicationName}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `medication-${reminder.id}`,
      requireInteraction: true
    };

    const notification = new Notification(`💊 Medication Reminder`, options);
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto-close after 30 seconds if not interacted with
    setTimeout(() => {
      notification.close();
    }, 30000);
  };

  const testNotification = () => {
    if (notificationPermission === 'granted') {
      showNotification({
        id: 'test',
        medicationName: 'Test Medication',
        dosage: '10mg',
        time: new Date().toTimeString().slice(0, 5),
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const updateSettings = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNestedSettings = (section: string, key: string, value: any) => {
    setSettings(prev => {
      const currentSection = prev[section as keyof NotificationSettings];
      if (typeof currentSection === 'object' && currentSection !== null) {
        return {
          ...prev,
          [section]: {
            ...currentSection,
            [key]: value
          }
        };
      }
      return prev;
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications-enabled" className="text-base font-medium">
                Enable Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders for your medications
              </p>
            </div>
            <Switch
              id="notifications-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSettings('enabled', checked)}
            />
          </div>

          {/* Browser Permission */}
          {notificationPermission !== 'granted' && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-yellow-900">Browser Notifications</h4>
                  <p className="text-sm text-yellow-700">
                    Allow browser notifications to receive medication reminders
                  </p>
                </div>
                <Button onClick={requestNotificationPermission} size="sm">
                  Enable
                </Button>
              </div>
            </div>
          )}

          {/* Notification Methods */}
          <div className="space-y-4">
            <h4 className="font-medium">Notification Methods</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <Label>Browser Notifications</Label>
                </div>
                <Switch
                  checked={settings.methods.browser}
                  onCheckedChange={(checked) => updateNestedSettings('methods', 'browser', checked)}
                  disabled={notificationPermission !== 'granted'}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <Label>Email Notifications</Label>
                </div>
                <Switch
                  checked={settings.methods.email}
                  onCheckedChange={(checked) => updateNestedSettings('methods', 'email', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <Label>SMS Notifications</Label>
                </div>
                <Switch
                  checked={settings.methods.sms}
                  onCheckedChange={(checked) => updateNestedSettings('methods', 'sms', checked)}
                />
              </div>
            </div>
          </div>

          {/* Timing Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Timing Settings</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Remind me before dose</Label>
                <Select 
                  value={settings.timing.beforeDose.toString()} 
                  onValueChange={(value) => updateNestedSettings('timing', 'beforeDose', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">At dose time</SelectItem>
                    <SelectItem value="5">5 minutes before</SelectItem>
                    <SelectItem value="15">15 minutes before</SelectItem>
                    <SelectItem value="30">30 minutes before</SelectItem>
                    <SelectItem value="60">1 hour before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Missed dose reminder</Label>
                <Select 
                  value={settings.timing.missedDose.toString()} 
                  onValueChange={(value) => updateNestedSettings('timing', 'missedDose', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes after</SelectItem>
                    <SelectItem value="30">30 minutes after</SelectItem>
                    <SelectItem value="60">1 hour after</SelectItem>
                    <SelectItem value="120">2 hours after</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Refill reminder</Label>
                <Select 
                  value={settings.timing.refillReminder.toString()} 
                  onValueChange={(value) => updateNestedSettings('timing', 'refillReminder', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 day before</SelectItem>
                    <SelectItem value="3">3 days before</SelectItem>
                    <SelectItem value="7">1 week before</SelectItem>
                    <SelectItem value="14">2 weeks before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Quiet Hours</h4>
                <p className="text-sm text-muted-foreground">
                  Disable notifications during these hours
                </p>
              </div>
              <Switch
                checked={settings.quietHours.enabled}
                onCheckedChange={(checked) => updateNestedSettings('quietHours', 'enabled', checked)}
              />
            </div>

            {settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start time</Label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => updateNestedSettings('quietHours', 'start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End time</Label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => updateNestedSettings('quietHours', 'end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Test Notification */}
          <div className="pt-4 border-t">
            <Button 
              onClick={testNotification} 
              variant="outline"
              disabled={!settings.enabled || notificationPermission !== 'granted'}
            >
              Test Notification
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getUpcomingReminders().slice(0, 5).map((reminder) => {
              const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
              const notificationTime = new Date(reminderTime.getTime() - (settings.timing.beforeDose * 60000));
              
              return (
                <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{reminder.medicationName}</p>
                      <p className="text-sm text-muted-foreground">
                        {reminder.dosage} at {reminder.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      {notificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Notification time
                    </p>
                  </div>
                </div>
              );
            })}
            
            {getUpcomingReminders().length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No upcoming notifications scheduled
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationNotifications;
