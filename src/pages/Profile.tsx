
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Phone, Settings, Bell, History, Wallet, Check } from "lucide-react";

const Profile = () => {
  const menuItems = [
    { icon: User, title: "Personal Information", subtitle: "Update your details" },
    { icon: Phone, title: "Linked Numbers", subtitle: "Manage mobile numbers" },
    { icon: Wallet, title: "Payment Methods", subtitle: "Cards & UPI" },
    { icon: Bell, title: "Notifications", subtitle: "Alerts & reminders" },
    { icon: History, title: "Transaction History", subtitle: "View all transactions" },
    { icon: Settings, title: "Settings", subtitle: "App preferences" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="My Profile" />
      
      <div className="p-4">
        {/* Profile Header */}
        <Card className="p-6 mb-6 green-gradient text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1">Rahul Sharma</h2>
          <p className="text-white/80 text-sm mb-1">+91 98765 43210</p>
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
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Card 
              key={index}
              className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
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
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
