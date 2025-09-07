import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Upload, 
  Download, 
  Share2, 
  Eye, 
  Lock,
  Heart,
  Activity,
  Pill,
  TestTube,
  Calendar,
  Search,
  Shield,
  Plus,
  MoreHorizontal
} from 'lucide-react';

const HealthRecords = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const records = [
    {
      id: 1,
      title: 'Annual Physical Checkup',
      type: 'checkup',
      date: '2024-03-10',
      doctor: 'Dr. Sarah Chen',
      facility: 'Downtown Medical Center',
      status: 'completed',
      fileSize: '2.4 MB',
      shared: ['Dr. Rodriguez', 'Family Doctor']
    },
    {
      id: 2,
      title: 'Blood Test Results',
      type: 'lab',
      date: '2024-03-08',
      doctor: 'Dr. Michael Rodriguez',
      facility: 'LabCorp',
      status: 'completed',
      fileSize: '1.2 MB',
      shared: []
    },
    {
      id: 3,
      title: 'Cardiology Consultation',
      type: 'consultation',
      date: '2024-03-05',
      doctor: 'Dr. Sarah Chen',
      facility: 'Heart Specialist Center',
      status: 'completed',
      fileSize: '3.1 MB',
      shared: ['Dr. Patel']
    }
  ];

  const medications = [
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      prescribedBy: 'Dr. Sarah Chen',
      startDate: '2024-02-15',
      duration: 'Ongoing'
    },
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      prescribedBy: 'Dr. Michael Rodriguez',
      startDate: '2024-01-20',
      duration: '3 months'
    }
  ];

  const vitals = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal', date: '2024-03-10' },
    { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal', date: '2024-03-10' },
    { label: 'Weight', value: '68', unit: 'kg', status: 'normal', date: '2024-03-10' },
    { label: 'Blood Sugar', value: '95', unit: 'mg/dL', status: 'normal', date: '2024-03-08' }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checkup': return <Heart className="w-4 h-4" />;
      case 'lab': return <TestTube className="w-4 h-4" />;
      case 'consultation': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-secondary-soft text-secondary';
      case 'high': return 'bg-accent-soft text-accent';
      case 'low': return 'bg-primary-soft text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Health Records</h1>
          <p className="text-muted-foreground">
            Secure access to your medical history and documents
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share Records
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Privacy Notice */}
      <Card className="mb-6 bg-gradient-soft border-primary/20">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-primary">Your Privacy is Protected</h3>
            <p className="text-sm text-muted-foreground">
              All medical records are encrypted and HIPAA compliant. You control who has access.
            </p>
          </div>
          <Button variant="soft" size="sm">
            Privacy Settings
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="records" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-4">
          <TabsTrigger value="records">Documents</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Documents */}
        <TabsContent value="records" className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search your medical records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl"
            />
          </div>

          {/* Records List */}
          <div className="space-y-4">
            {records.map((record) => (
              <Card key={record.id} className="shadow-card hover:shadow-soft transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-soft rounded-xl flex items-center justify-center">
                        {getTypeIcon(record.type)}
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg mb-1">{record.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(record.date).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <span>{record.doctor}</span>
                          <span>•</span>
                          <span>{record.facility}</span>
                          <span>•</span>
                          <span>{record.fileSize}</span>
                        </div>

                        {record.shared.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <Share2 className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Shared with: {record.shared.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        <Lock className="w-3 h-3 mr-1" />
                        Secure
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Vitals */}
        <TabsContent value="vitals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Latest Vital Signs</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Record Vitals
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vitals.map((vital) => (
              <Card key={vital.label} className="shadow-card hover:shadow-soft transition-all duration-200 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{vital.label}</h3>
                    <Badge className={getStatusColor(vital.status)} variant="secondary">
                      {vital.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary">
                      {vital.value}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        {vital.unit}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last recorded: {new Date(vital.date).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Blood Pressure Trends (Last 30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: '2024-03-10', systolic: 120, diastolic: 80 },
                    { date: '2024-03-08', systolic: 118, diastolic: 78 },
                    { date: '2024-03-05', systolic: 122, diastolic: 82 },
                    { date: '2024-03-01', systolic: 125, diastolic: 85 }
                  ].map((reading, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">{reading.date}</span>
                      <span className="font-medium">{reading.systolic}/{reading.diastolic} mmHg</span>
                      <Badge variant="secondary" className="bg-secondary-soft text-secondary">Normal</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Heart Rate Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gradient-soft rounded-2xl">
                    <div className="text-4xl font-bold text-primary mb-2">72</div>
                    <div className="text-muted-foreground">Average BPM</div>
                    <Badge variant="secondary" className="mt-2 bg-secondary-soft text-secondary">
                      Normal Range
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <div className="font-semibold text-primary">68</div>
                      <div className="text-muted-foreground">Resting</div>
                    </div>
                    <div>
                      <div className="font-semibold text-accent">95</div>
                      <div className="text-muted-foreground">Active</div>
                    </div>
                    <div>
                      <div className="font-semibold text-secondary">165</div>
                      <div className="text-muted-foreground">Max</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Medications */}
        <TabsContent value="medications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Current Medications</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          </div>

          {medications.map((med, index) => (
            <Card key={index} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center">
                      <Pill className="w-6 h-6 text-accent" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{med.name}</h3>
                      <p className="text-muted-foreground">{med.dosage} • {med.frequency}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Prescribed by: {med.prescribedBy}</span>
                        <span>•</span>
                        <span>Started: {new Date(med.startDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Duration: {med.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Set Reminder
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Health Timeline</h3>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Timeline
            </Button>
          </div>

          <div className="space-y-6">
            {[
              {
                date: '2024-03-10',
                type: 'checkup',
                title: 'Annual Physical Checkup',
                doctor: 'Dr. Sarah Chen',
                results: 'All vitals normal. Recommended continued healthy lifestyle.',
                icon: Heart
              },
              {
                date: '2024-03-08',
                type: 'lab',
                title: 'Blood Work Complete',
                doctor: 'Dr. Michael Rodriguez',
                results: 'Cholesterol levels improved. Blood sugar within normal range.',
                icon: TestTube
              },
              {
                date: '2024-03-05',
                type: 'consultation',
                title: 'Cardiology Follow-up',
                doctor: 'Dr. Sarah Chen',
                results: 'Heart function excellent. No concerns noted.',
                icon: Activity
              },
              {
                date: '2024-02-15',
                type: 'prescription',
                title: 'Medication Started',
                doctor: 'Dr. Sarah Chen',
                results: 'Started Lisinopril 10mg for blood pressure management.',
                icon: Pill
              }
            ].map((event, index) => (
              <Card key={index} className="shadow-card hover:shadow-soft transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center mb-2">
                        <event.icon className="w-6 h-6 text-primary" />
                      </div>
                      {index < 3 && (
                        <div className="w-0.5 h-16 bg-border"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground mb-2">
                        <span className="font-medium">{event.doctor}</span>
                      </p>
                      
                      <p className="text-foreground bg-muted/50 p-3 rounded-lg">
                        {event.results}
                      </p>
                      
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthRecords;