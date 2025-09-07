import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAIHealth, type HealthRisk } from '@/contexts/AIHealthContext';
import { 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Heart,
  Activity,
  Brain,
  Eye,
  Zap,
  Calendar,
  Target,
  Info
} from 'lucide-react';

const HealthRiskPredictor = () => {
  const { assessHealthRisks, getHealthRiskTrends } = useAIHealth();
  const [risks, setRisks] = useState<HealthRisk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('10-years');

  useEffect(() => {
    loadHealthRisks();
  }, []);

  const loadHealthRisks = async () => {
    setIsLoading(true);
    try {
      const healthRisks = await assessHealthRisks();
      setRisks(healthRisks);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (riskType: string) => {
    switch (riskType.toLowerCase()) {
      case 'cardiovascular disease':
      case 'heart disease':
        return <Heart className="w-5 h-5" />;
      case 'diabetes':
      case 'type 2 diabetes':
        return <Activity className="w-5 h-5" />;
      case 'stroke':
        return <Brain className="w-5 h-5" />;
      case 'cancer':
        return <Shield className="w-5 h-5" />;
      case 'eye disease':
        return <Eye className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'low': return 'default';
      case 'moderate': return 'secondary';
      case 'high': return 'destructive';
      default: return 'outline';
    }
  };

  const getOverallRiskScore = () => {
    if (risks.length === 0) return 0;
    const totalScore = risks.reduce((sum, risk) => {
      const levelScore = risk.riskLevel === 'high' ? 3 : risk.riskLevel === 'moderate' ? 2 : 1;
      return sum + (risk.probability * levelScore);
    }, 0);
    return Math.round(totalScore / risks.length);
  };

  const getHighestRisks = () => {
    return risks
      .filter(risk => risk.riskLevel === 'high' || risk.riskLevel === 'moderate')
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">Health Risk Predictions</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI-powered analysis of your health data to predict potential future health risks and provide 
          personalized prevention strategies.
        </p>
      </div>

      {/* Overall Risk Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Overall Health Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{getOverallRiskScore()}/10</div>
              <p className="text-sm text-muted-foreground">Overall Risk Score</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {risks.filter(r => r.riskLevel === 'low').length}
              </div>
              <p className="text-sm text-muted-foreground">Low Risk Conditions</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {risks.filter(r => r.riskLevel === 'moderate' || r.riskLevel === 'high').length}
              </div>
              <p className="text-sm text-muted-foreground">Conditions to Monitor</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Risk Factors */}
      {getHighestRisks().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              Priority Risk Factors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getHighestRisks().map((risk) => (
                <div key={risk.id} className={`p-4 border rounded-lg ${getRiskColor(risk.riskLevel)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getRiskIcon(risk.riskType)}
                      <div>
                        <h4 className="font-semibold">{risk.riskType}</h4>
                        <p className="text-sm opacity-80">{risk.timeframe}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getRiskBadgeVariant(risk.riskLevel)}>
                        {risk.riskLevel.toUpperCase()}
                      </Badge>
                      <p className="text-sm font-medium mt-1">{risk.probability}% risk</p>
                    </div>
                  </div>
                  <Progress value={risk.probability} className="mb-3" />
                  <p className="text-sm mb-3">{risk.description}</p>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Key Risk Factors:</h5>
                    <div className="flex flex-wrap gap-1">
                      {risk.factors.map((factor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Risk Assessments */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Analyzing your health data...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {risks.map((risk) => (
                <div key={risk.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getRiskIcon(risk.riskType)}
                      <div>
                        <h4 className="font-semibold">{risk.riskType}</h4>
                        <p className="text-sm text-muted-foreground">{risk.timeframe}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getRiskBadgeVariant(risk.riskLevel)}>
                        {risk.riskLevel.toUpperCase()}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{risk.probability}% probability</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <Progress value={risk.probability} className="mb-2" />
                    <p className="text-sm text-muted-foreground">{risk.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Contributing Factors:</h5>
                      <ul className="space-y-1">
                        {risk.factors.map((factor, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-1">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-sm mb-2">Prevention Strategies:</h5>
                      <ul className="space-y-1">
                        {risk.recommendations.slice(0, 3).map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-1">
                            <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground">
                      Based on: {risk.basedOn.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk Reduction Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            General Risk Reduction Strategies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Lifestyle Modifications</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Activity className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Regular physical activity (150 min/week)
                </li>
                <li className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Heart-healthy diet with fruits and vegetables
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Maintain healthy weight and BMI
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  Avoid smoking and limit alcohol
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Preventive Care</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  Regular health screenings and check-ups
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  Monitor key health metrics regularly
                </li>
                <li className="flex items-start gap-2">
                  <Brain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  Manage stress and prioritize mental health
                </li>
                <li className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  Stay informed about family health history
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Data */}
      <div className="text-center">
        <Button onClick={loadHealthRisks} disabled={isLoading}>
          {isLoading ? (
            <>
              <Brain className="w-4 h-4 mr-2 animate-pulse" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-2" />
              Refresh Risk Analysis
            </>
          )}
        </Button>
      </div>

      {/* Disclaimer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Important Note</h4>
              <p className="text-sm text-blue-800">
                These risk predictions are based on statistical models and your available health data. 
                They are estimates and should not replace professional medical advice. Consult with 
                your healthcare provider to discuss your individual risk factors and prevention strategies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthRiskPredictor;
