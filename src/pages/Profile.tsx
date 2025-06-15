
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, History, Settings, ChevronRight, Edit3 } from "lucide-react";
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
    interface Transaction {
      type: string;
      phoneNumber?: string;
    }
    
    const numbers = history
      .filter((transaction: Transaction) => transaction.type === 'Mobile Recharge' && transaction.phoneNumber)
      .map((transaction: Transaction) => transaction.phoneNumber as string);
    
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 pb-20">
      <Header title="Profile" showProfile={false} />
      
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <User size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{userInfo.name}</h2>
              <p className="text-green-600 font-medium">{userInfo.phone}</p>
              <p className="text-gray-500 text-sm">{userInfo.email}</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="border-green-200 hover:bg-green-50"
            >
              <Edit3 size={16} className="text-green-600" />
            </Button>
          </div>
        </Card>

        {/* Edit Profile Modal */}
        {isEditing && (
          <Card className="p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <Edit3 size={20} className="mr-2 text-green-600" />
              Edit Personal Information
            </h3>
            <div className="space-y-5">
              <div>
                <Label htmlFor="name" className="font-medium text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 border-green-200 focus:border-green-400"
                />
              </div>
              <div>
                <Label htmlFor="email" className="font-medium text-gray-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 border-green-200 focus:border-green-400"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} className="border-gray-300">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Linked Numbers Display */}
        <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
            <Phone size={18} className="mr-2 text-green-600" />
            Linked Numbers
          </h3>
          {linkedNumbers.length > 0 ? (
            <div className="space-y-3">
              {linkedNumbers.map((number, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Phone size={14} className="text-white" />
                    </div>
                    <span className="font-medium text-gray-700">{number}</span>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Phone size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No linked numbers found</p>
              <p className="text-sm text-gray-400">Numbers will appear here after mobile recharges</p>
            </div>
          )}
        </Card>

        {/* Profile Options */}
        <div className="space-y-3">
          {profileOptions.map((option, index) => (
            <Card key={index} className="p-4 shadow-md border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={option.action}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                    <option.icon size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{option.title}</h3>
                    <p className="text-sm text-gray-500">{option.subtitle}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
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
