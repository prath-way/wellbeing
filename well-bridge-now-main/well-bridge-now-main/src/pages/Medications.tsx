import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMedications } from '@/contexts/MedicationContext';
import AddMedicationForm from '@/components/AddMedicationForm';
import MedicationAnalytics from '@/components/MedicationAnalytics';
import MedicationNotifications from '@/components/MedicationNotifications';
import { 
  Pill, 
  Plus, 
  Search, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  MapPin,
  Bell,
  Shield,
  Activity,
  BarChart3,
  Settings
} from 'lucide-react';

const Medications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingMedication, setIsAddingMedication] = useState(false);
  const { 
    medications, 
    getTodaysReminders, 
    getRefillAlerts, 
    checkInteractions,
    getAdherenceRate 
  } = useMedications();

  const todaysReminders = getTodaysReminders();
  const refillAlerts = getRefillAlerts();
  const interactions = checkInteractions(medications.map(m => m.id));
  const overallAdherence = getAdherenceRate();

  const activeMedications = medications.filter(med => med.isActive);
  const filteredMedications = activeMedications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Medication Management</h1>
            <p className="text-muted-foreground">Track prescriptions, reminders, and refills</p>
          </div>
          <Button onClick={() => setIsAddingMedication(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Medication
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Medications</p>
                  <p className="text-2xl font-bold">{activeMedications.length}</p>
                </div>
                <Pill className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Reminders</p>
                  <p className="text-2xl font-bold">{todaysReminders.length}</p>
                </div>
                <Bell className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Adherence Rate</p>
                  <p className="text-2xl font-bold">{overallAdherence}%</p>
                </div>
                <Activity className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Refill Alerts</p>
                  <p className="text-2xl font-bold">{refillAlerts.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="medications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="medications">My Medications</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="refills">Refills</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="medications" className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Medication List */}
            <div className="grid gap-4">
              {filteredMedications.map((medication) => (
                <Card key={medication.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{medication.name}</h3>
                          {medication.genericName && (
                            <Badge variant="secondary">{medication.genericName}</Badge>
                          )}
                          <Badge variant={medication.isActive ? "default" : "secondary"}>
                            {medication.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Dosage</p>
                            <p className="font-medium">{medication.dosage}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Frequency</p>
                            <p className="font-medium">{medication.frequency}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Prescribed by</p>
                            <p className="font-medium">{medication.prescribedBy}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Refills</p>
                            <p className="font-medium">{medication.refillsRemaining}/{medication.totalRefills}</p>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mt-2">{medication.instructions}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">
                          <Calendar className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysReminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${reminder.isCompleted ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <div>
                          <p className="font-medium">{reminder.medicationName}</p>
                          <p className="text-sm text-muted-foreground">{reminder.dosage} at {reminder.time}</p>
                        </div>
                      </div>
                      {!reminder.isCompleted && (
                        <Button size="sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Taken
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="refills" className="space-y-6">
            <div className="space-y-4">
              {refillAlerts.map((alert) => (
                <Card key={alert.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-5 h-5 ${
                          alert.priority === 'high' ? 'text-red-500' : 
                          alert.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                        }`} />
                        <div>
                          <h3 className="font-semibold">{alert.medicationName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {alert.refillsRemaining} refills remaining • {alert.daysUntilEmpty} days left
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alert.pharmacy.name}
                          </p>
                        </div>
                      </div>
                      <Button>Request Refill</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Drug Interactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {interactions.length > 0 ? (
                  <div className="space-y-4">
                    {interactions.map((interaction, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={
                            interaction.severity === 'major' ? 'destructive' :
                            interaction.severity === 'moderate' ? 'secondary' : 'outline'
                          }>
                            {interaction.severity.toUpperCase()}
                          </Badge>
                          <span className="font-medium">
                            {interaction.medication1} + {interaction.medication2}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{interaction.description}</p>
                        <p className="text-sm text-muted-foreground">{interaction.recommendation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No drug interactions detected.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <MedicationAnalytics />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <MedicationNotifications />
          </TabsContent>
        </Tabs>

        {/* Add Medication Modal */}
        {isAddingMedication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <AddMedicationForm
                onClose={() => setIsAddingMedication(false)}
                onSuccess={() => {
                  setIsAddingMedication(false);
                  // Optionally show success message
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medications;
