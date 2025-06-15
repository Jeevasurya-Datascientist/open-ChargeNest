
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  History, 
  Settings as SettingsIcon,
  Edit3,
  Save,
  X
} from "lucide-react";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Header from "@/components/layout/Header";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    joinDate: "January 2024"
  });
  const [editData, setEditData] = useState({ ...userData });
  const [linkedNumbers, setLinkedNumbers] = useState<string[]>([]);

  useEffect(() => {
    // Get linked numbers from recharge history
    const rechargeData = localStorage.getItem('rechargeHistory');
    if (rechargeData) {
      try {
        const history = JSON.parse(rechargeData);
        const numbers = [...new Set(history.map((item: any) => item.phoneNumber).filter(Boolean))] as string[];
        setLinkedNumbers(numbers);
      } catch (error) {
        console.error('Error parsing recharge history:', error);
        setLinkedNumbers([]);
      }
    }
  }, []);

  const handleSave = () => {
    setUserData({ ...editData });
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const menuItems = [
    {
      id: 'personal-info',
      label: 'Personal Information',
      icon: User,
      action: () => setIsEditing(true),
      description: 'Edit your name and email'
    },
    {
      id: 'linked-numbers',
      label: 'Linked Numbers',
      icon: Phone,
      action: () => {},
      description: 'View your linked phone numbers'
    },
    {
      id: 'transaction-history',
      label: 'Transaction History',
      icon: History,
      action: () => navigate('/wallet'),
      description: 'View your transaction history'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      action: () => navigate('/settings'),
      description: 'App preferences and settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <Header />
      
      <div className="p-4 pb-20 max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="p-6 mb-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-20 w-20 ring-4 ring-green-200">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-green-gradient text-white text-lg font-semibold">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
              <p className="text-gray-600">{userData.email}</p>
              <p className="text-sm text-gray-500">Member since {userData.joinDate}</p>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleSave}
                  className="bg-green-gradient text-white hover:opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="border-gray-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item) => (
            <Card
              key={item.id}
              className="p-4 cursor-pointer hover:shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm border-0 hover:bg-white/90"
              onClick={item.action}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <item.icon className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.label}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  {item.id === 'linked-numbers' && (
                    <div className="mt-2">
                      {linkedNumbers.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {linkedNumbers.map((number, index) => (
                            <span
                              key={index}
                              className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                            >
                              {number}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">No linked numbers found</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-gray-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
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
