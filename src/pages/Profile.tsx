
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, History, Settings, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210"
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [linkedNumbers, setLinkedNumbers] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load user info from localStorage
    const savedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (Object.keys(savedUserInfo).length > 0) {
      setUserInfo(prev => ({ ...prev, ...savedUserInfo }));
    }

    // Get linked numbers from transaction history
    const history = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    const numbers = history
      .filter((transaction: any) => transaction.type === 'Mobile Recharge' && transaction.phoneNumber)
      .map((transaction: any) => transaction.phoneNumber as string);
    
    const uniqueNumbers = Array.from(new Set(numbers));
    setLinkedNumbers(uniqueNumbers);
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const profileOptions = [
    {
      icon: User,
      title: "Personal Information",
      subtitle: "Edit your profile details",
      action: () => setIsEditing(true)
    },
    {
      icon: Phone,
      title: "Linked Numbers",
      subtitle: `${linkedNumbers.length} numbers linked`,
      action: () => {} // Show linked numbers in the same component
    },
    {
      icon: History,
      title: "Transaction History",
      subtitle: "View your payment history",
      action: () => navigate('/wallet')
    },
    {
      icon: Settings,
      title: "Settings",
      subtitle: "App preferences and settings",
      action: () => navigate('/settings')
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Profile" showProfile={false} />
      
      <div className="p-4">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-primary rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{userInfo.name}</h2>
              <p className="text-muted-foreground">{userInfo.phone}</p>
            </div>
          </div>
        </Card>

        {/* Edit Profile Modal */}
        {isEditing && (
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Edit Personal Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveProfile}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}

        {/* Linked Numbers Display */}
        <Card className="p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Linked Numbers</h3>
          {linkedNumbers.length > 0 ? (
            <div className="space-y-2">
              {linkedNumbers.map((number, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-green-primary" />
                    <span>{number}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No linked numbers found</p>
          )}
        </Card>

        {/* Profile Options */}
        <div className="space-y-3">
          {profileOptions.map((option, index) => (
            <Card key={index} className="p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={option.action}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-light rounded-lg">
                    <option.icon size={20} className="text-green-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.subtitle}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
