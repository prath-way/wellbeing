import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import healthcareHero from '@/assets/healthcare-hero.jpg';
import { 
  Search, 
  MapPin, 
  Clock, 
  Shield, 
  Users, 
  Heart, 
  Stethoscope,
  Phone,
  Calendar,
  FileText,
  Activity,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 border border-blue-100 dark:border-blue-800">
              <Heart className="w-4 h-4" />
              Trusted by 50,000+ families
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900 dark:text-white leading-tight">
              Your Health,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Simplified
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with trusted doctors, manage appointments, and take control of your health journey—all in one beautiful platform.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  placeholder="Search doctors, clinics, or specialties..."
                  className="pl-14 pr-32 h-16 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
                <Button 
                  size="lg" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-xl px-6"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all" 
                asChild
              >
                <Link to="/search">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Find Doctors
                </Link>
              </Button>
              <Button 
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Phone className="w-5 h-5 mr-2" />
                Emergency
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link to="/ai-assistant">
                  <Activity className="w-5 h-5 mr-2" />
                  AI Health
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Everything you need for better health
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive healthcare services designed for modern life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Doctor Search */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Find Trusted Doctors</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Search verified healthcare professionals by location, specialty, and ratings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3" asChild>
                  <Link to="/search">
                    Start Searching
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Appointments */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Easy Appointments</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Book, reschedule, and manage appointments with real-time availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-3" asChild>
                  <Link to="/appointments">
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* AI Health Assistant */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">AI Health Assistant</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Get personalized health insights and recommendations powered by AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-3" asChild>
                  <Link to="/ai-assistant">
                    Try AI Health
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Health Records */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Secure Records</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Store and share your medical history securely with privacy controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3" asChild>
                  <Link to="/records">
                    View Records
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Wellness Hub */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Wellness Hub</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                  Track your fitness, set health goals, and monitor your progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-3" asChild>
                  <Link to="/wellness">
                    Start Wellness
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Emergency */}
            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-200 dark:border-red-800 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-red-900 dark:text-red-100">Emergency Support</CardTitle>
                <CardDescription className="text-red-700 dark:text-red-300 text-base">
                  24/7 emergency assistance with GPS location and quick response
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-3">
                  Emergency SOS
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-3">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">50K+</div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium">Verified Doctors</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">200K+</div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium">Happy Patients</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">24/7</div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium">Emergency Support</div>
            </div>
            <div className="space-y-3">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">99.9%</div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium">Uptime</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;