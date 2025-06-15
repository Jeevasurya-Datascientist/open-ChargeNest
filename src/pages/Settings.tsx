
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Moon, Sun, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    biometricAuth: false
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('appSettings') || '{}');
    setSettings(prev => ({ ...prev, ...savedSettings }));
    
    // Apply dark mode to document
    if (savedSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const updateSetting = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    
    // Apply dark mode immediately
    if (key === 'darkMode') {
      if (value) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved.",
    });
  };

  const handleBiometricAuth = (checked: boolean) => {
    if (checked) {
      // Check if biometric authentication is available
      if ('credentials' in navigator) {
        navigator.credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: { name: "GreenCharge" },
            user: {
              id: new Uint8Array(16),
              name: "user@example.com",
              displayName: "User"
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required"
            }
          }
        }).then(() => {
          updateSetting('biometricAuth', true);
          toast({
            title: "Biometric Authentication Enabled",
            description: "You can now use your device's biometric authentication.",
          });
        }).catch(() => {
          toast({
            title: "Biometric Authentication Unavailable",
            description: "Your device doesn't support biometric authentication.",
            variant: "destructive"
          });
        });
      } else {
        toast({
          title: "Feature Not Supported",
          description: "Biometric authentication is not supported on this device.",
          variant: "destructive"
        });
      }
    } else {
      updateSetting('biometricAuth', false);
    }
  };

  const resetAllSettings = () => {
    const defaultSettings = {
      darkMode: false,
      biometricAuth: false
    };
    
    setSettings(defaultSettings);
    localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    
    // Reset dark mode
    document.documentElement.classList.remove('dark');
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  const settingsOptions = [
    {
      icon: settings.darkMode ? Moon : Sun,
      title: "Dark Mode",
      subtitle: "Toggle dark/light theme",
      key: "darkMode",
      value: settings.darkMode,
      handler: (checked: boolean) => updateSetting('darkMode', checked)
    },
    {
      icon: Shield,
      title: "Biometric Authentication",
      subtitle: "Use device biometric authentication",
      key: "biometricAuth",
      value: settings.biometricAuth,
      handler: handleBiometricAuth
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
                  onCheckedChange={option.handler}
                />
              </div>
            </Card>
          ))}

          <div className="mt-8 space-y-3">
            <h3 className="text-lg font-semibold">Reset Options</h3>
            
            <Card className="p-4">
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={resetAllSettings}
              >
                Reset All Settings
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                This will reset app preferences only. Your recharges, wallet, and history will not be affected.
              </p>
            </Card>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Settings;
