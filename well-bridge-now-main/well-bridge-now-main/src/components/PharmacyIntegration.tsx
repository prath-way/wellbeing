import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMedications } from '@/contexts/MedicationContext';
import { MapPin, Phone, Clock, Star, Plus, Check } from 'lucide-react';

const PharmacyIntegration = () => {
  const { pharmacies, addPharmacy, setPreferredPharmacy, requestRefill } = useMedications();
  const [isAddingPharmacy, setIsAddingPharmacy] = useState(false);
  const [newPharmacy, setNewPharmacy] = useState({
    name: '',
    address: '',
    phone: '',
    hours: ''
  });

  const handleAddPharmacy = () => {
    if (newPharmacy.name && newPharmacy.address) {
      addPharmacy({
        ...newPharmacy,
        isPreferred: pharmacies.length === 0
      });
      setNewPharmacy({ name: '', address: '', phone: '', hours: '' });
      setIsAddingPharmacy(false);
    }
  };

  const handleSetPreferred = (pharmacyId: string) => {
    setPreferredPharmacy(pharmacyId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Pharmacies</h2>
        <Dialog open={isAddingPharmacy} onOpenChange={setIsAddingPharmacy}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Pharmacy
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Pharmacy</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Pharmacy name"
                value={newPharmacy.name}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, name: e.target.value })}
              />
              <Input
                placeholder="Address"
                value={newPharmacy.address}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, address: e.target.value })}
              />
              <Input
                placeholder="Phone number"
                value={newPharmacy.phone}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, phone: e.target.value })}
              />
              <Input
                placeholder="Hours (e.g., 8 AM - 10 PM)"
                value={newPharmacy.hours}
                onChange={(e) => setNewPharmacy({ ...newPharmacy, hours: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddPharmacy} className="flex-1">
                  Add Pharmacy
                </Button>
                <Button variant="outline" onClick={() => setIsAddingPharmacy(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {pharmacies.map((pharmacy) => (
          <Card key={pharmacy.id} className={pharmacy.isPreferred ? 'ring-2 ring-primary' : ''}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{pharmacy.name}</h3>
                    {pharmacy.isPreferred && (
                      <Badge variant="default">
                        <Star className="w-3 h-3 mr-1" />
                        Preferred
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {pharmacy.address}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {pharmacy.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {pharmacy.hours}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!pharmacy.isPreferred && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetPreferred(pharmacy.id)}
                    >
                      Set as Preferred
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pharmacies.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pharmacies added</h3>
            <p className="text-muted-foreground mb-4">
              Add your preferred pharmacies to manage prescriptions and refills
            </p>
            <Button onClick={() => setIsAddingPharmacy(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Pharmacy
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PharmacyIntegration;
