import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useMedications } from '@/contexts/MedicationContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart
} from 'lucide-react';

const MedicationAnalytics = () => {
  const { 
    medications, 
    reminders, 
    getAdherenceRate, 
    getMissedDoses 
  } = useMedications();
  
  const [timeRange, setTimeRange] = useState('7'); // days
  const [selectedMedication, setSelectedMedication] = useState('all');

  // Calculate analytics
  const activeMedications = medications.filter(med => med.isActive);
  const overallAdherence = getAdherenceRate();
  const missedDoses = getMissedDoses(parseInt(timeRange));
  
  // Weekly adherence data
  const getWeeklyAdherence = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayReminders = reminders.filter(r => r.date === date.toISOString().split('T')[0]);
      const completed = dayReminders.filter(r => r.isCompleted).length;
      const total = dayReminders.length;
      const adherence = total > 0 ? Math.round((completed / total) * 100) : 100;
      
      days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        adherence,
        completed,
        total
      });
    }
    return days;
  };

  const weeklyData = getWeeklyAdherence();
  
  // Medication-specific analytics
  const getMedicationStats = () => {
    return activeMedications.map(med => {
      const medReminders = reminders.filter(r => r.medicationId === med.id);
      const completed = medReminders.filter(r => r.isCompleted).length;
      const total = medReminders.length;
      const adherence = total > 0 ? Math.round((completed / total) * 100) : 100;
      
      return {
        ...med,
        adherence,
        completed,
        total,
        missed: total - completed
      };
    }).sort((a, b) => b.adherence - a.adherence);
  };

  const medicationStats = getMedicationStats();

  // Time-based insights
  const getTimeInsights = () => {
    const timeSlots = {
      morning: { count: 0, completed: 0 }, // 6-12
      afternoon: { count: 0, completed: 0 }, // 12-18
      evening: { count: 0, completed: 0 }, // 18-24
      night: { count: 0, completed: 0 } // 0-6
    };

    reminders.forEach(reminder => {
      const hour = parseInt(reminder.time.split(':')[0]);
      let slot: keyof typeof timeSlots;
      
      if (hour >= 6 && hour < 12) slot = 'morning';
      else if (hour >= 12 && hour < 18) slot = 'afternoon';
      else if (hour >= 18 && hour < 24) slot = 'evening';
      else slot = 'night';

      timeSlots[slot].count++;
      if (reminder.isCompleted) timeSlots[slot].completed++;
    });

    return Object.entries(timeSlots).map(([time, data]) => ({
      time: time.charAt(0).toUpperCase() + time.slice(1),
      adherence: data.count > 0 ? Math.round((data.completed / data.count) * 100) : 100,
      ...data
    }));
  };

  const timeInsights = getTimeInsights();

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return 'text-green-600';
    if (adherence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAdherenceBadge = (adherence: number) => {
    if (adherence >= 90) return 'default';
    if (adherence >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-4">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="14">Last 14 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Adherence</p>
                <p className={`text-2xl font-bold ${getAdherenceColor(overallAdherence)}`}>
                  {overallAdherence}%
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Missed Doses</p>
                <p className="text-2xl font-bold text-red-600">{missedDoses.length}</p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Medications</p>
                <p className="text-2xl font-bold">{activeMedications.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Perfect Days</p>
                <p className="text-2xl font-bold text-green-600">
                  {weeklyData.filter(d => d.adherence === 100).length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Adherence Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Weekly Adherence Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium">{day.date}</div>
                <div className="flex-1">
                  <Progress value={day.adherence} className="h-3" />
                </div>
                <div className="w-16 text-sm text-right">
                  <span className={getAdherenceColor(day.adherence)}>
                    {day.adherence}%
                  </span>
                </div>
                <div className="w-20 text-xs text-muted-foreground text-right">
                  {day.completed}/{day.total}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medication Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Medication Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {medicationStats.map((med) => (
              <div key={med.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{med.name}</h4>
                    <Badge variant={getAdherenceBadge(med.adherence)}>
                      {med.adherence}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{med.dosage}</span>
                    <span>{med.frequency}</span>
                    <span>{med.completed}/{med.total} doses taken</span>
                  </div>
                </div>
                <div className="w-32">
                  <Progress value={med.adherence} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time-based Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Adherence by Time of Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {timeInsights.map((insight) => (
              <div key={insight.time} className="text-center p-4 border rounded-lg">
                <h4 className="font-medium mb-2">{insight.time}</h4>
                <div className={`text-2xl font-bold mb-1 ${getAdherenceColor(insight.adherence)}`}>
                  {insight.adherence}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {insight.completed}/{insight.count} doses
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {overallAdherence >= 90 && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Excellent Adherence!</h4>
                  <p className="text-sm text-green-700">
                    You're doing great with your medication routine. Keep up the good work!
                  </p>
                </div>
              </div>
            )}

            {overallAdherence < 70 && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Adherence Needs Improvement</h4>
                  <p className="text-sm text-red-700">
                    Consider setting more reminders or discussing with your doctor about simplifying your regimen.
                  </p>
                </div>
              </div>
            )}

            {missedDoses.length > 5 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Multiple Missed Doses</h4>
                  <p className="text-sm text-yellow-700">
                    You've missed {missedDoses.length} doses recently. Consider adjusting your reminder times.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationAnalytics;
