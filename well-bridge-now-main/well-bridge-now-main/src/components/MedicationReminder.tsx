import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMedications } from '@/contexts/MedicationContext';
import { Bell, CheckCircle, Clock, Pill, AlertCircle } from 'lucide-react';

const MedicationReminder = () => {
  const { getTodaysReminders, getUpcomingReminders, markReminderCompleted } = useMedications();
  const [selectedReminder, setSelectedReminder] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const todaysReminders = getTodaysReminders();
  const upcomingReminders = getUpcomingReminders();
  const overdueReminders = todaysReminders.filter(reminder => {
    const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
    return reminderTime < currentTime && !reminder.isCompleted;
  });

  const handleMarkCompleted = (reminderId: string, notes?: string) => {
    markReminderCompleted(reminderId, notes);
    setSelectedReminder(null);
    setNotes('');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Overdue Reminders */}
      {overdueReminders.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              Overdue Medications ({overdueReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div>
                      <p className="font-medium text-red-900">{reminder.medicationName}</p>
                      <p className="text-sm text-red-700">{reminder.dosage} • Due at {formatTime(reminder.time)}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => setSelectedReminder(reminder)}
                  >
                    Mark Taken
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingReminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <div>
                      <p className="font-medium">{reminder.medicationName}</p>
                      <p className="text-sm text-muted-foreground">{reminder.dosage} • {formatTime(reminder.time)}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{formatTime(reminder.time)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Today */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Completed Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todaysReminders.filter(r => r.isCompleted).map((reminder) => (
              <div key={reminder.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">{reminder.medicationName}</p>
                  <p className="text-sm text-green-700">{reminder.dosage} • Taken at {formatTime(reminder.time)}</p>
                  {reminder.notes && (
                    <p className="text-xs text-green-600 mt-1">Note: {reminder.notes}</p>
                  )}
                </div>
              </div>
            ))}
            {todaysReminders.filter(r => r.isCompleted).length === 0 && (
              <p className="text-muted-foreground text-center py-4">No medications taken yet today</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedReminder} onOpenChange={() => setSelectedReminder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Mark Medication as Taken
            </DialogTitle>
          </DialogHeader>
          {selectedReminder && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold">{selectedReminder.medicationName}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedReminder.dosage} • Scheduled for {formatTime(selectedReminder.time)}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optional)</label>
                <Textarea
                  placeholder="Any notes about taking this medication..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => handleMarkCompleted(selectedReminder.id, notes)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Taken
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedReminder(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicationReminder;
