
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Moon, Sun, Bell, Shield, Smartphone, Wifi } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    soundEnabled: true,
    autoRecharge: false,
    biometricAuth: false,
    dataUsage: true
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    setSettings(prev => ({ ...prev, ...savedSettings }));
  }, []);

  const updateSetting = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved.",
    });
  };

  const settingsOptions = [
    {
      icon: settings.darkMode ? Moon : Sun,
      title: "Dark Mode",
      subtitle: "Toggle dark/light theme",
      key: "darkMode",
      value: settings.darkMode
    },
    {
      icon: Bell,
      title: "Push Notifications",
      subtitle: "Receive alerts and updates",
      key: "notifications",
      value: settings.notifications
    },
    {
      icon: Smartphone,
      title: "Sound Effects",
      subtitle: "Enable button sounds",
      key: "soundEnabled",
      value: settings.soundEnabled
    },
    {
      icon: Wifi,
      title: "Auto Recharge",
      subtitle: "Automatic balance top-up",
      key: "autoRecharge",
      value: settings.autoRecharge
    },
    {
      icon: Shield,
      title: "Biometric Authentication",
      subtitle: "Use fingerprint/face ID",
      key: "biometricAuth",
      value: settings.biometricAuth
    },
    {
      icon: Smartphone,
      title: "Data Usage Alerts",
      subtitle: "Monitor app data usage",
      key: "dataUsage",
      value: settings.dataUsage
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Settings" showProfile={false} />
      
      <div className="p-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/profile')}
          className="mb-4 p-2"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Profile
        </Button>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-4">App Preferences</h2>
          
          {settingsOptions.map((option, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-light rounded-lg">
                    <option.icon size={20} className="text-green-primary" />
                  </div>
                  <div>
                    <Label htmlFor={option.key} className="font-medium cursor-pointer">
                      {option.title}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.subtitle}</p>
                  </div>
                </div>
                <Switch
                  id={option.key}
                  checked={option.value}
                  onCheckedChange={(checked) => updateSetting(option.key, checked)}
                />
              </div>
            </Card>
          ))}

          <div className="mt-8 space-y-3">
            <h3 className="text-lg font-semibold">Account Actions</h3>
            
            <Card className="p-4">
              <Button variant="outline" className="w-full">
                Clear Cache
              </Button>
            </Card>
            
            <Card className="p-4">
              <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                Reset All Settings
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
