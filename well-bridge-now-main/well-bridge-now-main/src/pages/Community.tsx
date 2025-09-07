import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Plus,
  Search,
  TrendingUp,
  Calendar,
  MapPin,
  Star,
  ThumbsUp,
  MessageCircle,
  BookOpen,
  Shield
} from 'lucide-react';

const Community = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const discussions = [
    {
      id: 1,
      title: 'Managing Type 2 Diabetes - Tips and Support',
      author: 'Sarah M.',
      avatar: '/api/placeholder/40/40',
      category: 'Chronic Conditions',
      replies: 23,
      likes: 45,
      timeAgo: '2 hours ago',
      preview: 'Looking for advice on meal planning and glucose monitoring...',
      tags: ['diabetes', 'nutrition', 'support']
    },
    {
      id: 2,
      title: 'Postpartum Mental Health Resources',
      author: 'Dr. Jennifer Wong',
      avatar: '/api/placeholder/40/40',
      category: 'Mental Health',
      replies: 18,
      likes: 67,
      timeAgo: '4 hours ago',
      preview: 'Sharing some valuable resources for new mothers experiencing...',
      tags: ['postpartum', 'mental-health', 'resources'],
      verified: true
    },
    {
      id: 3,
      title: 'Local Walking Group - Downtown Area',
      author: 'Mike R.',
      avatar: '/api/placeholder/40/40',
      category: 'Fitness',
      replies: 8,
      likes: 21,
      timeAgo: '6 hours ago',
      preview: 'Starting a weekly walking group every Saturday morning...',
      tags: ['fitness', 'local', 'walking']
    }
  ];

  const healthCamps = [
    {
      title: 'Free Blood Pressure Screening',
      date: '2024-03-20',
      location: 'Community Center, Downtown',
      organizer: 'City Health Department',
      attendees: 45,
      category: 'Screening'
    },
    {
      title: 'Diabetes Education Workshop',
      date: '2024-03-25',
      location: 'Memorial Hospital',
      organizer: 'Diabetes Support Network',
      attendees: 32,
      category: 'Education'
    },
    {
      title: 'Mental Health Awareness Seminar',
      date: '2024-03-28',
      location: 'Wellness Center',
      organizer: 'Mental Health Alliance',
      attendees: 78,
      category: 'Mental Health'
    }
  ];

  const supportGroups = [
    {
      name: 'Heart Health Support',
      members: 234,
      description: 'Support for heart disease patients and families',
      category: 'Cardiac Care',
      meetingDay: 'Thursdays'
    },
    {
      name: 'Cancer Survivors Network',
      members: 189,
      description: 'Connecting cancer survivors and their loved ones',
      category: 'Cancer Support',
      meetingDay: 'Tuesdays'
    },
    {
      name: 'New Parents Circle',
      members: 156,
      description: 'Support for new and expecting parents',
      category: 'Family Health',
      meetingDay: 'Sundays'
    }
  ];

  const categories = [
    'General Health',
    'Chronic Conditions',
    'Mental Health',
    'Fitness',
    'Nutrition',
    'Family Health',
    'Senior Care'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Health Community</h1>
          <p className="text-muted-foreground">
            Connect, learn, and support each other on your health journey
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Start Discussion
        </Button>
      </div>

      {/* Community Guidelines */}
      <Card className="mb-6 bg-gradient-soft border-primary/20">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-primary">Safe & Supportive Environment</h3>
            <p className="text-sm text-muted-foreground">
              Our community follows strict guidelines to ensure respectful health discussions.
            </p>
          </div>
          <Button variant="soft" size="sm">
            Community Guidelines
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="discussions" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="events">Health Events</TabsTrigger>
          <TabsTrigger value="groups">Support Groups</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Discussions */}
        <TabsContent value="discussions" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-2xl"
              />
            </div>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant="ghost"
                      className="w-full justify-start text-sm"
                    >
                      {category}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Discussion List */}
            <div className="lg:col-span-3 space-y-4">
              {discussions.map((discussion) => (
                <Card key={discussion.id} className="shadow-card hover:shadow-soft transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={discussion.avatar} />
                        <AvatarFallback>
                          {discussion.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                            {discussion.title}
                          </h3>
                          {discussion.verified && (
                            <Badge variant="default" className="bg-primary-soft text-primary">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                          <span className="font-medium">{discussion.author}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {discussion.category}
                          </Badge>
                          <span>•</span>
                          <span>{discussion.timeAgo}</span>
                        </div>

                        <p className="text-muted-foreground mb-3">{discussion.preview}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{discussion.replies} replies</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{discussion.likes} likes</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Health Events */}
        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Upcoming Health Events</h3>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthCamps.map((event, index) => (
              <Card key={index} className="shadow-card hover:shadow-soft transition-all duration-200">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge variant="secondary" className="mb-2">
                      {event.category}
                    </Badge>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Organized by {event.organizer}
                  </p>

                  <Button className="w-full" variant="outline">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Support Groups */}
        <TabsContent value="groups" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Support Groups</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportGroups.map((group, index) => (
              <Card key={index} className="shadow-card hover:shadow-soft transition-all duration-200">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-2">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">{group.description}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{group.members} members</span>
                    </div>
                    <Badge variant="outline">{group.meetingDay}</Badge>
                  </div>

                  <Badge variant="secondary" className="mb-4 text-xs">
                    {group.category}
                  </Badge>

                  <Button className="w-full" variant="outline">
                    Join Group
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources" className="space-y-4">
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Health Resources</h3>
              <p className="text-muted-foreground mb-4">
                Access educational materials, guides, and trusted health information
              </p>
              <Button variant="hero">
                Browse Resources
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;