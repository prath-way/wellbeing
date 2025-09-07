import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMedications, type Medication } from '@/contexts/MedicationContext';
import { Plus, X, Clock, AlertCircle } from 'lucide-react';

interface AddMedicationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddMedicationForm: React.FC<AddMedicationFormProps> = ({ onClose, onSuccess }) => {
  const { addMedication, pharmacies } = useMedications();
  const [reminderTimes, setReminderTimes] = useState<string[]>(['08:00']);
  const [sideEffects, setSideEffects] = useState<string[]>([]);
  const [newSideEffect, setNewSideEffect] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    dosage: '',
    strength: '',
    frequency: '',
    route: 'oral' as const,
    prescribedBy: '',
    prescribedDate: '',
    startDate: '',
    endDate: '',
    refillsRemaining: 0,
    totalRefills: 0,
    instructions: '',
    category: 'prescription' as const,
    quantity: 0,
    daysSupply: 30,
    pharmacyId: ''
  });

  const commonMedications = [
    'Lisinopril', 'Metformin', 'Amlodipine', 'Metoprolol', 'Omeprazole',
    'Simvastatin', 'Losartan', 'Albuterol', 'Gabapentin', 'Hydrochlorothiazide'
  ];

  const frequencies = [
    'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
    'Every 8 hours', 'Every 12 hours', 'As needed', 'Weekly', 'Monthly'
  ];

  const routes = [
    { value: 'oral', label: 'Oral (by mouth)' },
    { value: 'injection', label: 'Injection' },
    { value: 'topical', label: 'Topical (on skin)' },
    { value: 'inhaled', label: 'Inhaled' },
    { value: 'other', label: 'Other' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addReminderTime = () => {
    setReminderTimes(prev => [...prev, '12:00']);
  };

  const updateReminderTime = (index: number, time: string) => {
    setReminderTimes(prev => prev.map((t, i) => i === index ? time : t));
  };

  const removeReminderTime = (index: number) => {
    if (reminderTimes.length > 1) {
      setReminderTimes(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addSideEffect = () => {
    if (newSideEffect.trim() && !sideEffects.includes(newSideEffect.trim())) {
      setSideEffects(prev => [...prev, newSideEffect.trim()]);
      setNewSideEffect('');
    }
  };

  const removeSideEffect = (effect: string) => {
    setSideEffects(prev => prev.filter(e => e !== effect));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dosage || !formData.frequency) {
      alert('Please fill in all required fields');
      return;
    }

    const selectedPharmacy = pharmacies.find(p => p.id === formData.pharmacyId);

    const newMedication: Omit<Medication, 'id'> = {
      ...formData,
      sideEffects,
      reminderTimes,
      isActive: true,
      pharmacy: selectedPharmacy,
      route: formData.route as Medication['route']
    };

    addMedication(newMedication);
    onSuccess();
    onClose();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Add New Medication</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Medication Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter medication name"
                  list="common-medications"
                  required
                />
                <datalist id="common-medications">
                  {commonMedications.map(med => (
                    <option key={med} value={med} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-2">
                <Label htmlFor="genericName">Generic Name</Label>
                <Input
                  id="genericName"
                  value={formData.genericName}
                  onChange={(e) => handleInputChange('genericName', e.target.value)}
                  placeholder="Generic name (if different)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage *</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => handleInputChange('dosage', e.target.value)}
                  placeholder="e.g., 10mg, 1 tablet"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="strength">Strength</Label>
                <Input
                  id="strength"
                  value={formData.strength}
                  onChange={(e) => handleInputChange('strength', e.target.value)}
                  placeholder="e.g., 10mg, 500mg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map(freq => (
                      <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="route">Route</Label>
                <Select value={formData.route} onValueChange={(value) => handleInputChange('route', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map(route => (
                      <SelectItem key={route.value} value={route.value}>{route.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                placeholder="Special instructions for taking this medication"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Prescription Details */}
        <Card>
          <CardHeader>
            <CardTitle>Prescription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prescribedBy">Prescribed By</Label>
                <Input
                  id="prescribedBy"
                  value={formData.prescribedBy}
                  onChange={(e) => handleInputChange('prescribedBy', e.target.value)}
                  placeholder="Doctor's name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prescribedDate">Prescribed Date</Label>
                <Input
                  id="prescribedDate"
                  type="date"
                  value={formData.prescribedDate}
                  onChange={(e) => handleInputChange('prescribedDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (if applicable)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                  placeholder="Number of pills/doses"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="daysSupply">Days Supply</Label>
                <Input
                  id="daysSupply"
                  type="number"
                  value={formData.daysSupply}
                  onChange={(e) => handleInputChange('daysSupply', parseInt(e.target.value) || 30)}
                  placeholder="30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalRefills">Total Refills</Label>
                <Input
                  id="totalRefills"
                  type="number"
                  value={formData.totalRefills}
                  onChange={(e) => handleInputChange('totalRefills', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="refillsRemaining">Refills Remaining</Label>
                <Input
                  id="refillsRemaining"
                  type="number"
                  value={formData.refillsRemaining}
                  onChange={(e) => handleInputChange('refillsRemaining', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pharmacy">Pharmacy</Label>
              <Select value={formData.pharmacyId} onValueChange={(value) => handleInputChange('pharmacyId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pharmacy" />
                </SelectTrigger>
                <SelectContent>
                  {pharmacies.map(pharmacy => (
                    <SelectItem key={pharmacy.id} value={pharmacy.id}>
                      {pharmacy.name} - {pharmacy.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reminder Times */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Reminder Times
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reminderTimes.map((time, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => updateReminderTime(index, e.target.value)}
                  className="w-32"
                />
                {reminderTimes.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReminderTime(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addReminderTime}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Reminder Time
            </Button>
          </CardContent>
        </Card>

        {/* Side Effects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Side Effects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSideEffect}
                onChange={(e) => setNewSideEffect(e.target.value)}
                placeholder="Add a side effect"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSideEffect())}
              />
              <Button type="button" onClick={addSideEffect} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sideEffects.map(effect => (
                <Badge key={effect} variant="secondary" className="flex items-center gap-1">
                  {effect}
                  <button
                    type="button"
                    onClick={() => removeSideEffect(effect)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            Add Medication
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicationForm;
