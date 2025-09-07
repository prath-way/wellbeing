import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAIHealth, type PersonalizedRecommendation } from '@/contexts/AIHealthContext';
import { 
  Lightbulb, 
  Target, 
  TrendingUp,
  Heart,
  Activity,
  Apple,
  Moon,
  Brain,
  Shield,
  Calendar,
  CheckCircle,
  Star,
  Clock,
  Zap
} from 'lucide-react';

const PersonalizedRecommendations = () => {
  const { getPersonalizedRecommendations } = useAIHealth();
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [completedRecommendations, setCompletedRecommendations] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const recs = await getPersonalizedRecommendations();
      setRecommendations(recs);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Recommendations', icon: Lightbulb },
    { id: 'fitness', label: 'Fitness & Exercise', icon: Activity },
    { id: 'nutrition', label: 'Nutrition & Diet', icon: Apple },
    { id: 'mental-health', label: 'Mental Health', icon: Brain },
    { id: 'sleep', label: 'Sleep & Recovery', icon: Moon },
    { id: 'preventive-care', label: 'Preventive Care', icon: Shield },
    { id: 'lifestyle', label: 'Lifestyle', icon: Heart }
  ];

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return <Activity className="w-4 h-4" />;
      case 'nutrition': return <Apple className="w-4 h-4" />;
      case 'mental-health': return <Brain className="w-4 h-4" />;
      case 'sleep': return <Moon className="w-4 h-4" />;
      case 'preventive-care': return <Shield className="w-4 h-4" />;
      case 'lifestyle': return <Heart className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const toggleRecommendationComplete = (id: string) => {
    setCompletedRecommendations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getCompletionRate = () => {
    if (recommendations.length === 0) return 0;
    return Math.round((completedRecommendations.size / recommendations.length) * 100);
  };

  const getHighPriorityCount = () => {
    return recommendations.filter(rec => rec.priority === 'high').length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Lightbulb className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold">Personalized Health Recommendations</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI-powered personalized recommendations based on your health data, goals, and risk factors 
          to help you optimize your health and wellbeing.
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Your Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{recommendations.length}</div>
              <p className="text-sm text-muted-foreground">Total Recommendations</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{completedRecommendations.size}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">{getHighPriorityCount()}</div>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{getCompletionRate()}%</div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Overall Progress</span>
              <span className="text-sm font-medium">{getCompletionRate()}%</span>
            </div>
            <Progress value={getCompletionRate()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              const count = category.id === 'all' 
                ? recommendations.length 
                : recommendations.filter(rec => rec.category === category.id).length;
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                  <Badge variant="secondary" className="ml-1">
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCategory === 'all' ? 'All Recommendations' : 
             categories.find(c => c.id === selectedCategory)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Generating personalized recommendations...</p>
            </div>
          ) : filteredRecommendations.length === 0 ? (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recommendations found for this category.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecommendations.map((recommendation) => {
                const isCompleted = completedRecommendations.has(recommendation.id);
                
                return (
                  <div 
                    key={recommendation.id} 
                    className={`border rounded-lg p-4 transition-all ${
                      isCompleted ? 'bg-green-50 border-green-200 opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRecommendationComplete(recommendation.id)}
                          className={`p-1 h-auto ${isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}
                        >
                          <CheckCircle className={`w-5 h-5 ${isCompleted ? 'fill-current' : ''}`} />
                        </Button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getCategoryIcon(recommendation.category)}
                            <h4 className={`font-semibold ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                              {recommendation.title}
                            </h4>
                            <Badge variant={getPriorityBadgeVariant(recommendation.priority)}>
                              {recommendation.priority.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <p className={`text-sm mb-3 ${isCompleted ? 'text-muted-foreground' : ''}`}>
                            {recommendation.description}
                          </p>

                          {recommendation.actionItems.length > 0 && (
                            <div className="mb-3">
                              <h5 className="font-medium text-sm mb-2">Action Items:</h5>
                              <ul className="space-y-1">
                                {recommendation.actionItems.map((item, index) => (
                                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            {recommendation.timeToSeeResults && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {recommendation.timeToSeeResults}
                              </div>
                            )}
                            {recommendation.expectedBenefit && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {recommendation.expectedBenefit}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              Priority: {recommendation.priority}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${
                                i < 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {recommendation.basedOn && recommendation.basedOn.length > 0 && (
                      <div className="pt-3 border-t">
                        <p className="text-xs text-muted-foreground">
                          Based on: {recommendation.basedOn.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <Target className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium">Set Health Goals</div>
                <div className="text-sm text-muted-foreground">Create specific, measurable goals</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <Calendar className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium">Schedule Check-up</div>
                <div className="text-sm text-muted-foreground">Book preventive care appointment</div>
              </div>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium">Track Progress</div>
                <div className="text-sm text-muted-foreground">Monitor your health metrics</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Refresh Recommendations */}
      <div className="text-center">
        <Button onClick={loadRecommendations} disabled={isLoading}>
          {isLoading ? (
            <>
              <Brain className="w-4 h-4 mr-2 animate-pulse" />
              Generating...
            </>
          ) : (
            <>
              <Lightbulb className="w-4 h-4 mr-2" />
              Refresh Recommendations
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
