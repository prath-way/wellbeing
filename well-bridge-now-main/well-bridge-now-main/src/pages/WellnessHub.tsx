import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Heart, 
  Leaf, 
  Moon, 
  Zap,
  Target,
  Trophy,
  Calendar,
  Clock,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Apple,
  Dumbbell,
  Brain,
  Medal
} from 'lucide-react';

const WellnessHub = () => {
  const todayStats = {
    steps: { current: 8247, target: 10000 },
    water: { current: 6, target: 8 },
    sleep: { current: 7.5, target: 8 },
    calories: { current: 1850, target: 2100 }
  };

  const weeklyGoals = [
    { name: 'Daily Steps', progress: 78, target: '10,000 steps/day', icon: Activity },
    { name: 'Water Intake', progress: 85, target: '8 glasses/day', icon: Leaf },
    { name: 'Sleep Quality', progress: 92, target: '8 hours/night', icon: Moon },
    { name: 'Active Minutes', progress: 65, target: '30 min/day', icon: Heart }
  ];

  const workoutPlans = [
    {
      title: 'Morning Yoga',
      duration: '15 min',
      difficulty: 'Beginner',
      calories: '45 cal',
      image: '/api/placeholder/300/200'
    },
    {
      title: 'HIIT Cardio',
      duration: '20 min',
      difficulty: 'Intermediate',
      calories: '180 cal',
      image: '/api/placeholder/300/200'
    },
    {
      title: 'Strength Training',
      duration: '30 min',
      difficulty: 'Advanced',
      calories: '220 cal',
      image: '/api/placeholder/300/200'
    }
  ];

  const achievements = [
    { name: '7-Day Streak', icon: Trophy, earned: true },
    { name: 'Step Champion', icon: Activity, earned: true },
    { name: 'Hydration Hero', icon: Leaf, earned: false },
    { name: 'Sleep Master', icon: Moon, earned: false }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Wellness Hub</h1>
        <p className="text-muted-foreground">
          Your personal health and fitness companion
        </p>
      </div>

      {/* Daily Overview */}
      <Card className="mb-8 bg-gradient-wellness border-0 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Today's Progress</h2>
              <p className="opacity-90">Keep up the great work!</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">82%</div>
              <div className="text-sm opacity-90">Daily Goal</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-2xl p-4">
              <Activity className="w-6 h-6 mb-2" />
              <div className="text-2xl font-bold">{todayStats.steps.current.toLocaleString()}</div>
              <div className="text-sm opacity-90">Steps</div>
              <Progress 
                value={(todayStats.steps.current / todayStats.steps.target) * 100} 
                className="mt-2 bg-white/20"
              />
            </div>

            <div className="bg-white/20 rounded-2xl p-4">
              <Leaf className="w-6 h-6 mb-2" />
              <div className="text-2xl font-bold">{todayStats.water.current}</div>
              <div className="text-sm opacity-90">Glasses</div>
              <Progress 
                value={(todayStats.water.current / todayStats.water.target) * 100} 
                className="mt-2 bg-white/20"
              />
            </div>

            <div className="bg-white/20 rounded-2xl p-4">
              <Moon className="w-6 h-6 mb-2" />
              <div className="text-2xl font-bold">{todayStats.sleep.current}h</div>
              <div className="text-sm opacity-90">Sleep</div>
              <Progress 
                value={(todayStats.sleep.current / todayStats.sleep.target) * 100} 
                className="mt-2 bg-white/20"
              />
            </div>

            <div className="bg-white/20 rounded-2xl p-4">
              <Zap className="w-6 h-6 mb-2" />
              <div className="text-2xl font-bold">{todayStats.calories.current}</div>
              <div className="text-sm opacity-90">Calories</div>
              <Progress 
                value={(todayStats.calories.current / todayStats.calories.target) * 100} 
                className="mt-2 bg-white/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Workouts */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5" />
                    Quick Workouts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {workoutPlans.map((workout, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-video bg-muted rounded-xl overflow-hidden mb-3">
                          <div className="w-full h-full bg-gradient-primary opacity-20"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Button variant="hero" size="sm">
                              <Play className="w-4 h-4 mr-2" />
                              Start
                            </Button>
                          </div>
                        </div>
                        <h3 className="font-semibold">{workout.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{workout.duration}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {workout.difficulty}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Goals */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Weekly Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {weeklyGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <goal.icon className="w-4 h-4 text-primary" />
                          <span className="font-medium">{goal.name}</span>
                        </div>
                        <span className="text-sm font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground">{goal.target}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Achievements */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {achievements.map((achievement, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-xl text-center transition-colors ${
                          achievement.earned 
                            ? 'bg-gradient-primary text-white' 
                            : 'bg-muted/50 text-muted-foreground'
                        }`}
                      >
                        <achievement.icon className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-xs font-medium">{achievement.name}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Health Tips */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Health Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary-soft rounded-xl">
                      <h4 className="font-medium text-primary mb-1">Great Progress!</h4>
                      <p className="text-sm text-muted-foreground">
                        You've increased your daily steps by 15% this week.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-secondary-soft rounded-xl">
                      <h4 className="font-medium text-secondary mb-1">Hydration Reminder</h4>
                      <p className="text-sm text-muted-foreground">
                        Try to drink water every 2 hours for better hydration.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Workouts Tab */}
        <TabsContent value="workouts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { category: 'Strength Training', workouts: 15, image: '💪' },
              { category: 'Cardio', workouts: 12, image: '🏃‍♂️' },
              { category: 'Yoga & Flexibility', workouts: 8, image: '🧘‍♀️' },
              { category: 'HIIT', workouts: 6, image: '⚡' },
              { category: 'Pilates', workouts: 5, image: '🤸‍♀️' },
              { category: 'Sports', workouts: 4, image: '🏀' }
            ].map((category) => (
              <Card key={category.category} className="shadow-card hover:shadow-soft transition-all duration-200 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.image}</div>
                  <h3 className="font-semibold text-lg mb-2">{category.category}</h3>
                  <p className="text-muted-foreground mb-4">{category.workouts} workouts</p>
                  <Button variant="outline" className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Start Workout
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Apple className="w-5 h-5" />
                  Meal Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
                    <div key={meal} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div>
                        <h4 className="font-medium">{meal}</h4>
                        <p className="text-sm text-muted-foreground">Plan your {meal.toLowerCase()}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Plan
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Daily Nutrition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <div className="text-2xl font-bold text-primary">68g</div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                    <Progress value={75} className="mt-2 h-1" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">185g</div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                    <Progress value={85} className="mt-2 h-1" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">52g</div>
                    <div className="text-xs text-muted-foreground">Fat</div>
                    <Progress value={65} className="mt-2 h-1" />
                  </div>
                </div>
                
                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Log Today's Meals
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mindfulness Tab */}
        <TabsContent value="mindfulness" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Meditation Sessions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'Morning Clarity', duration: '10 min', type: 'Guided' },
                  { title: 'Stress Relief', duration: '15 min', type: 'Breathing' },
                  { title: 'Sleep Preparation', duration: '20 min', type: 'Body Scan' },
                  { title: 'Focus Boost', duration: '5 min', type: 'Mindfulness' }
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-soft rounded-xl">
                    <div>
                      <h4 className="font-medium">{session.title}</h4>
                      <p className="text-sm text-muted-foreground">{session.duration} • {session.type}</p>
                    </div>
                    <Button variant="soft" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  Sleep & Recovery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-gradient-soft rounded-2xl">
                  <div className="text-4xl font-bold text-primary mb-2">7.5h</div>
                  <div className="text-muted-foreground mb-4">Last Night's Sleep</div>
                  <Badge variant="secondary" className="bg-secondary-soft text-secondary">
                    Good Quality
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Moon className="w-4 h-4 mr-2" />
                    Sleep Stories
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Relaxation Music
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WellnessHub;