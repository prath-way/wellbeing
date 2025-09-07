import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useAIHealth, type Symptom, type SymptomAnalysis } from '@/contexts/AIHealthContext';
import { 
  Plus, 
  X, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Brain,
  Stethoscope,
  TrendingUp,
  Calendar,
  Shield
} from 'lucide-react';

const SymptomChecker = () => {
  const { analyzeSymptoms, isAnalyzing, lastAnalysis } = useAIHealth();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState({
    name: '',
    severity: 'mild' as const,
    duration: '',
    frequency: 'occasional' as const,
    location: '',
    description: ''
  });
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);

  const commonSymptoms = [
    'Headache', 'Fever', 'Cough', 'Sore throat', 'Runny nose', 'Fatigue',
    'Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'Back pain',
    'Chest pain', 'Shortness of breath', 'Dizziness', 'Muscle aches',
    'Joint pain', 'Rash', 'Itching', 'Swelling', 'Loss of appetite'
  ];

  const addSymptom = () => {
    if (currentSymptom.name.trim()) {
      const newSymptom: Symptom = {
        id: Date.now().toString(),
        ...currentSymptom,
        associatedSymptoms: []
      };
      
      setSymptoms(prev => [...prev, newSymptom]);
      setCurrentSymptom({
        name: '',
        severity: 'mild',
        duration: '',
        frequency: 'occasional',
        location: '',
        description: ''
      });
    }
  };

  const removeSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
  };

  const handleAnalyze = async () => {
    if (symptoms.length > 0) {
      const result = await analyzeSymptoms(symptoms);
      setAnalysis(result);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'emergency': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'medium': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-5 h-5 text-green-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">AI Symptom Checker</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Describe your symptoms and get AI-powered analysis with possible conditions and recommendations.
          This tool is for informational purposes only and should not replace professional medical advice.
        </p>
      </div>

      {/* Add Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Your Symptoms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Symptom Name *</Label>
              <Input
                value={currentSymptom.name}
                onChange={(e) => setCurrentSymptom(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter symptom name"
                list="common-symptoms"
              />
              <datalist id="common-symptoms">
                {commonSymptoms.map(symptom => (
                  <option key={symptom} value={symptom} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <Label>Severity</Label>
              <Select 
                value={currentSymptom.severity} 
                onValueChange={(value: any) => setCurrentSymptom(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                value={currentSymptom.duration}
                onChange={(e) => setCurrentSymptom(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 2 days, 1 week"
              />
            </div>

            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select 
                value={currentSymptom.frequency} 
                onValueChange={(value: any) => setCurrentSymptom(prev => ({ ...prev, frequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="constant">Constant</SelectItem>
                  <SelectItem value="intermittent">Intermittent</SelectItem>
                  <SelectItem value="occasional">Occasional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location (if applicable)</Label>
              <Input
                value={currentSymptom.location}
                onChange={(e) => setCurrentSymptom(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., left side, upper abdomen"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Additional Description</Label>
            <Textarea
              value={currentSymptom.description}
              onChange={(e) => setCurrentSymptom(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe any additional details about this symptom"
              rows={3}
            />
          </div>

          <Button onClick={addSymptom} disabled={!currentSymptom.name.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Symptom
          </Button>
        </CardContent>
      </Card>

      {/* Current Symptoms */}
      {symptoms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Symptoms ({symptoms.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {symptoms.map((symptom) => (
                <div key={symptom.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{symptom.name}</h4>
                      <Badge className={getSeverityColor(symptom.severity)}>
                        {symptom.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {symptom.duration && <span>Duration: {symptom.duration} • </span>}
                      <span>Frequency: {symptom.frequency}</span>
                      {symptom.location && <span> • Location: {symptom.location}</span>}
                    </div>
                    {symptom.description && (
                      <p className="text-sm text-muted-foreground mt-1">{symptom.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSymptom(symptom.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || symptoms.length === 0}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze My Symptoms
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {(analysis || lastAnalysis) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5" />
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {(() => {
              const currentAnalysis = analysis || lastAnalysis!;
              
              return (
                <>
                  {/* Urgency Level */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getUrgencyIcon(currentAnalysis.analysis.urgencyLevel)}
                      <div>
                        <h4 className="font-medium">Urgency Level</h4>
                        <p className={`text-sm ${getUrgencyColor(currentAnalysis.analysis.urgencyLevel)}`}>
                          {currentAnalysis.analysis.urgencyLevel.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="font-medium">{currentAnalysis.confidence}%</p>
                    </div>
                  </div>

                  {/* Red Flags */}
                  {currentAnalysis.analysis.redFlags.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h4 className="font-medium text-red-900">Important Warning Signs</h4>
                      </div>
                      <ul className="space-y-1">
                        {currentAnalysis.analysis.redFlags.map((flag, index) => (
                          <li key={index} className="text-sm text-red-800">• {flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Possible Conditions */}
                  <div>
                    <h4 className="font-medium mb-3">Possible Conditions</h4>
                    <div className="space-y-3">
                      {currentAnalysis.analysis.possibleConditions.map((condition, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{condition.name}</h5>
                            <div className="flex items-center gap-2">
                              <Progress value={condition.probability} className="w-20 h-2" />
                              <span className="text-sm text-muted-foreground">
                                {Math.round(condition.probability)}%
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{condition.description}</p>
                          <p className="text-sm"><strong>When to see a doctor:</strong> {condition.whenToSeeDoctor}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-medium mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      {currentAnalysis.analysis.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div>
                    <h4 className="font-medium mb-3">Next Steps</h4>
                    <div className="space-y-2">
                      {currentAnalysis.analysis.nextSteps.map((step, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Medical Disclaimer</h4>
                        <p className="text-sm text-blue-800">
                          This AI analysis is for informational purposes only and should not replace professional 
                          medical advice, diagnosis, or treatment. Always consult with a qualified healthcare 
                          provider for medical concerns.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Getting Started */}
      {symptoms.length === 0 && !analysis && (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start Your Symptom Analysis</h3>
            <p className="text-muted-foreground mb-4">
              Add your symptoms above to get AI-powered health insights and recommendations
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-md mx-auto">
              {commonSymptoms.slice(0, 8).map(symptom => (
                <Button
                  key={symptom}
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSymptom(prev => ({ ...prev, name: symptom }))}
                >
                  {symptom}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SymptomChecker;
