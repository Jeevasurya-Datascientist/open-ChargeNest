
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Settings, Bell, History, Check, FileText, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showLinkedNumbers, setShowLinkedNumbers] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [personalInfo, setPersonalInfo] = useState({
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210"
  });
  
  const [linkedNumbers, setLinkedNumbers] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from localStorage
    const savedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (savedUserData.name) {
      setPersonalInfo(prev => ({ ...prev, ...savedUserData }));
    }

    // Load linked numbers from transaction history
    const transactions = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    const phoneNumbers = [...new Set(transactions
      .filter((t: any) => t.fullNumber || t.number)
      .map((t: any) => t.fullNumber || t.number)
    )];
    setLinkedNumbers(phoneNumbers);

    // Load notifications
    const savedNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    setNotifications(savedNotifications);
  }, []);

  const handleSavePersonalInfo = () => {
    localStorage.setItem('userData', JSON.stringify(personalInfo));
    toast({
      title: "Profile Updated",
      description: "Your personal information has been saved successfully.",
    });
    setShowPersonalInfo(false);
  };

  const handleTransactionHistory = () => {
    navigate('/wallet');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const menuItems = [
    { 
      icon: User, 
      title: "Personal Information", 
      subtitle: "Update your details",
      onClick: () => setShowPersonalInfo(true)
    },
    { 
      icon: Phone, 
      title: "Linked Numbers", 
      subtitle: "Manage mobile numbers",
      onClick: () => setShowLinkedNumbers(true)
    },
    { 
      icon: Bell, 
      title: "Notifications", 
      subtitle: "View notifications",
      onClick: () => setShowNotifications(true)
    },
    { 
      icon: History, 
      title: "Transaction History", 
      subtitle: "View wallet transactions",
      onClick: handleTransactionHistory
    },
    { 
      icon: Settings, 
      title: "Settings", 
      subtitle: "App preferences",
      onClick: handleSettings
    },
  ];

  const legalItems = [
    { 
      icon: FileText, 
      title: "Terms & Conditions", 
      subtitle: "Service terms",
      onClick: () => setShowTerms(true)
    },
    { 
      icon: Shield, 
      title: "Privacy Policy", 
      subtitle: "Data protection",
      onClick: () => setShowPrivacy(true)
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="My Profile" showProfile={false} />
      
      <div className="p-4">
        {/* Profile Header */}
        <Card className="p-6 mb-6 green-gradient text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1">{personalInfo.name}</h2>
          <p className="text-white/80 text-sm mb-1">{personalInfo.phone}</p>
          <div className="flex items-center justify-center space-x-1 text-white/90">
            <Check size={14} />
            <span className="text-xs">Verified Account</span>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 text-center">
            <div className="text-lg font-bold text-green-primary">47</div>
            <div className="text-xs text-muted-foreground">Recharges</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-lg font-bold text-green-primary">₹12,450</div>
            <div className="text-xs text-muted-foreground">Total Spent</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-lg font-bold text-green-primary">₹320</div>
            <div className="text-xs text-muted-foreground">Cashback</div>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-3 mb-6">
          {menuItems.map((item, index) => (
            <Card 
              key={index}
              className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={item.onClick}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-light rounded-lg">
                  <item.icon size={20} className="text-green-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
                <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full transform rotate-45"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Legal Section */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-semibold text-gray-600 px-2">Legal</h3>
          {legalItems.map((item, index) => (
            <Card 
              key={index}
              className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200"
              onClick={item.onClick}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <item.icon size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
                <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full transform rotate-45"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <Button 
            variant="outline" 
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Personal Information Dialog */}
      <Dialog open={showPersonalInfo} onOpenChange={setShowPersonalInfo}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Personal Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email address"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={personalInfo.phone}
                onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">Phone number cannot be changed</p>
            </div>
            <Button onClick={handleSavePersonalInfo} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Linked Numbers Dialog */}
      <Dialog open={showLinkedNumbers} onOpenChange={setShowLinkedNumbers}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Linked Numbers</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {linkedNumbers.length > 0 ? (
              linkedNumbers.map((number, index) => (
                <Card key={index} className="p-3">
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-green-primary" />
                    <span className="font-medium">{number}</span>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No linked numbers found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <Card key={index} className="p-4">
                  <h4 className="font-semibold mb-2">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-500">{new Date(notification.timestamp).toLocaleString()}</p>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No notifications yet</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms & Conditions Dialog */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms & Conditions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <section>
              <h4 className="font-semibold mb-2">1. Service Agreement</h4>
              <p>By using GreenCharge, you agree to our recharge and bill payment services. We facilitate transactions between you and service providers.</p>
            </section>
            
            <section>
              <h4 className="font-semibold mb-2">2. Transaction Processing</h4>
              <p>All transactions are processed in real-time. A service fee may apply. Refunds are subject to operator policies and may take 3-5 business days.</p>
            </section>
            
            <section>
              <h4 className="font-semibold mb-2">3. User Responsibilities</h4>
              <p>Users must provide accurate information and are responsible for all transactions made through their account. Report any unauthorized transactions immediately.</p>
            </section>
            
            <section>
              <h4 className="font-semibold mb-2">4. Limitation of Liability</h4>
              <p>GreenCharge is not liable for operator service failures, network issues, or delays beyond our control. Our liability is limited to the transaction amount.</p>
            </section>
            
            <section>
              <h4 className="font-semibold mb-2">5. Modification of Terms</h4>
              <p>We reserve the right to modify these terms. Users will be notified of significant changes via the app or email.</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <section>
              <h4 className="font-semibold mb-2">Data Collection</h4>
              <p>We collect personal information including phone numbers, transaction history, and device information to provide our services effectively.</p>
            </section>
            
            <section>
              <h4 className="font-semibold mb-2">Data Usage</h4>
              <p>Your data is used to process transactions, provide customer support, prevent fraud, and improve our services. We do not sell personal information.</p>
            </section>
            
            <section>
              <h4 className="font-semibold mb-2">Data Security</h4>
              <p>We use industry-standard encryption and security measures to protect your data. All payment information is encrypted and securely transmitted.</p>
            </section>
            
            <section>
              <h4 className="font-semibold mb-2">Data Sharing</h4>
              <p>We share data only with service providers necessary for transaction processing and as required by law. We do not share data for marketing purposes.</p>
            </section>
            
            <section>
              <h4 className="font-semibold mb-2">Your Rights</h4>
              <p>You can access, update, or delete your personal information by contacting support. You can also opt out of non-essential communications.</p>
            </section>
            
            <section>
              <h4 className="font-semibold mb-2">Contact Us</h4>
              <p>For privacy concerns, contact us at privacy@greencharge.com or call +91 1800-XXX-XXXX.</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
