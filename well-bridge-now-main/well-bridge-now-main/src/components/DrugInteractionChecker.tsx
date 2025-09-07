import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMedications } from '@/contexts/MedicationContext';
import { Shield, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const DrugInteractionChecker = () => {
  const { medications, checkInteractions } = useMedications();
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);

  const handleMedicationSelect = (medicationId: string) => {
    const newSelection = selectedMedications.includes(medicationId)
      ? selectedMedications.filter(id => id !== medicationId)
      : [...selectedMedications, medicationId];
    
    setSelectedMedications(newSelection);
    
    if (newSelection.length >= 2) {
      const foundInteractions = checkInteractions(newSelection);
      setInteractions(foundInteractions);
    } else {
      setInteractions([]);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'major': return 'destructive';
      case 'moderate': return 'secondary';
      case 'minor': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'major': return <AlertTriangle className="w-4 h-4" />;
      case 'moderate': return <Info className="w-4 h-4" />;
      case 'minor': return <CheckCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Drug Interaction Checker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select medications to check for interactions:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {medications.filter(med => med.isActive).map((medication) => (
                <div key={medication.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={medication.id}
                    checked={selectedMedications.includes(medication.id)}
                    onChange={() => handleMedicationSelect(medication.id)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={medication.id} className="text-sm">
                    {medication.name} ({medication.dosage})
                  </label>
                </div>
              ))}
            </div>
          </div>

          {selectedMedications.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Selected medications:</p>
              <div className="flex flex-wrap gap-2">
                {selectedMedications.map(id => {
                  const med = medications.find(m => m.id === id);
                  return med ? (
                    <Badge key={id} variant="secondary">
                      {med.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interaction Results */}
      {selectedMedications.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Interaction Results</CardTitle>
          </CardHeader>
          <CardContent>
            {interactions.length > 0 ? (
              <div className="space-y-4">
                {interactions.map((interaction, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={getSeverityColor(interaction.severity)}>
                        {getSeverityIcon(interaction.severity)}
                        {interaction.severity.toUpperCase()}
                      </Badge>
                      <span className="font-medium">
                        {interaction.medication1} + {interaction.medication2}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Description:</p>
                        <p className="text-sm">{interaction.description}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Recommendation:</p>
                        <p className="text-sm">{interaction.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-lg font-medium text-green-700">No interactions found</p>
                <p className="text-sm text-muted-foreground">
                  The selected medications appear to be safe to take together.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedMedications.length < 2 && (
        <Card>
          <CardContent className="text-center py-8">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Select at least 2 medications to check for interactions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DrugInteractionChecker;
