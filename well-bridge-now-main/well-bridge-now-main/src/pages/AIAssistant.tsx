import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAIHealth } from '@/contexts/AIHealthContext';
import SymptomChecker from '@/components/SymptomChecker';
import HealthRiskPredictor from '@/components/HealthRiskPredictor';
import PersonalizedRecommendations from '@/components/PersonalizedRecommendations';
import SmartScheduling from '@/components/SmartScheduling';
import { 
  Brain, 
  Stethoscope, 
  TrendingUp, 
  Lightbulb, 
  Calendar,
  MessageCircle,
  Activity,
  Shield,
  Zap,
  Heart,
  Target,
  Clock
} from 'lucide-react';

const AIAssistant = () => {
  const { lastAnalysis, isAnalyzing } = useAIHealth();
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      id: 'symptom-checker',
      title: 'AI Symptom Checker',
      description: 'Analyze your symptoms with AI-powered medical insights',
      icon: Stethoscope,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'risk-prediction',
      title: 'Health Risk Prediction',
      description: 'Predict future health risks based on your data',
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      id: 'recommendations',
      title: 'Personalized Recommendations',
      description: 'Get tailored health and lifestyle recommendations',
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: 'smart-scheduling',
      title: 'Smart Scheduling',
      description: 'AI-powered appointment scheduling suggestions',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const quickStats = [
    {
      label: 'AI Features',
      value: '4',
      icon: Brain,
      color: 'text-primary'
    },
    {
      label: 'Health Insights',
      value: '24/7',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      label: 'Accuracy Rate',
      value: '95%',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      label: 'Response Time',
      value: '<2s',
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">AI Health Assistant</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your intelligent health companion powered by advanced AI. Get personalized insights, 
            risk assessments, and smart recommendations for better health management.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-4 text-center">
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="symptom-checker">Symptom Checker</TabsTrigger>
            <TabsTrigger value="risk-prediction">Risk Prediction</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="smart-scheduling">Smart Scheduling</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity */}
            {lastAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Symptom Analysis Completed</h4>
                      <p className="text-sm text-muted-foreground">
                        Analyzed {lastAnalysis.symptoms.length} symptoms with {lastAnalysis.confidence}% confidence
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(lastAnalysis.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={
                      lastAnalysis.analysis.urgencyLevel === 'emergency' ? 'destructive' :
                      lastAnalysis.analysis.urgencyLevel === 'high' ? 'secondary' : 'default'
                    }>
                      {lastAnalysis.analysis.urgencyLevel.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={feature.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${feature.borderColor}`}
                    onClick={() => setActiveTab(feature.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${feature.bgColor}`}>
                          <Icon className={`w-5 h-5 ${feature.color}`} />
                        </div>
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <Button variant="outline" size="sm">
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* AI Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  AI Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-medium mb-2">Medical Knowledge Base</h4>
                    <p className="text-sm text-muted-foreground">
                      Trained on extensive medical literature and clinical guidelines
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Heart className="w-8 h-8 text-red-600 mx-auto mb-3" />
                    <h4 className="font-medium mb-2">Personalized Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Considers your health history, demographics, and risk factors
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-medium mb-2">Continuous Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      Improves recommendations based on outcomes and feedback
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle>Getting Started with AI Health Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Start with Symptom Checker</h4>
                      <p className="text-sm text-muted-foreground">
                        Describe your symptoms to get AI-powered analysis and recommendations
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Review Risk Predictions</h4>
                      <p className="text-sm text-muted-foreground">
                        Understand your future health risks and prevention strategies
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Follow Personalized Recommendations</h4>
                      <p className="text-sm text-muted-foreground">
                        Implement AI-generated health and lifestyle recommendations
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Use Smart Scheduling</h4>
                      <p className="text-sm text-muted-foreground">
                        Get matched with the right healthcare providers at optimal times
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Important Disclaimer */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Important Medical Disclaimer</h4>
                    <p className="text-sm text-blue-800">
                      This AI Health Assistant is designed to provide health information and support decision-making. 
                      It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult 
                      with qualified healthcare providers for medical concerns and before making health-related decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feature Tabs */}
          <TabsContent value="symptom-checker">
            <SymptomChecker />
          </TabsContent>

          <TabsContent value="risk-prediction">
            <HealthRiskPredictor />
          </TabsContent>

          <TabsContent value="recommendations">
            <PersonalizedRecommendations />
          </TabsContent>

          <TabsContent value="smart-scheduling">
            <SmartScheduling />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIAssistant;
