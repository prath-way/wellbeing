import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage, Language, CulturalInsight } from '@/contexts/LanguageContext';
import { Globe, Info, Users, MessageCircle, Utensils, Heart } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { currentLanguage, availableLanguages, setLanguage, getCulturalInsights } = useLanguage();
  const [showCulturalInsights, setShowCulturalInsights] = useState(false);

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
  };

  const currentInsights = getCulturalInsights(currentLanguage.code);

  const CulturalInsightsCard: React.FC<{ insights: CulturalInsight }> = ({ insights }) => (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          <h4 className="font-semibold">Common Greetings</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {insights.insights.greetings.map((greeting, index) => (
            <Badge key={index} variant="secondary" className="text-sm">
              {greeting}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-primary" />
          <h4 className="font-semibold">Family Involvement</h4>
        </div>
        <p className="text-sm text-muted-foreground">{insights.insights.familyInvolvement}</p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          <h4 className="font-semibold">Communication Style</h4>
        </div>
        <p className="text-sm text-muted-foreground">{insights.insights.communicationStyle}</p>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Utensils className="w-4 h-4 text-primary" />
          <h4 className="font-semibold">Dietary Considerations</h4>
        </div>
        <div className="space-y-1">
          {insights.insights.dietaryConsiderations.map((consideration, index) => (
            <p key={index} className="text-sm text-muted-foreground">• {consideration}</p>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-primary" />
          <h4 className="font-semibold">Health Concerns</h4>
        </div>
        <div className="space-y-1">
          {insights.insights.healthConcerns.map((concern, index) => (
            <p key={index} className="text-sm text-muted-foreground">• {concern}</p>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-primary" />
          <h4 className="font-semibold">Religious Considerations</h4>
        </div>
        <div className="space-y-1">
          {insights.insights.religiousConsiderations.map((consideration, index) => (
            <p key={index} className="text-sm text-muted-foreground">• {consideration}</p>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            <Globe className="w-4 h-4" />
            <span className="text-lg">{currentLanguage.flag}</span>
            <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Select Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="max-h-64 overflow-y-auto">
            {availableLanguages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className={`flex items-center gap-3 ${
                  currentLanguage.code === language.code ? 'bg-accent' : ''
                }`}
              >
                <span className="text-lg">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{language.name}</span>
                  <span className="text-xs text-muted-foreground">{language.nativeName}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {currentInsights && (
        <Dialog open={showCulturalInsights} onOpenChange={setShowCulturalInsights}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Cultural Insights</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="text-lg">{currentLanguage.flag}</span>
                Cultural Health Insights - {currentLanguage.name}
              </DialogTitle>
            </DialogHeader>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Healthcare Cultural Considerations</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Understanding cultural preferences helps provide better, more respectful healthcare.
                </p>
              </CardHeader>
              <CardContent>
                <CulturalInsightsCard insights={currentInsights} />
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LanguageSelector;
