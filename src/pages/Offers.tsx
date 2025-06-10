
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Clock, Check } from "lucide-react";

const Offers = () => {
  const offers = [
    {
      title: "Mega Cashback Offer",
      description: "Get ₹100 cashback on mobile recharge above ₹500",
      validity: "Valid till 31st Dec 2024",
      code: "MEGA100",
      discount: "20%",
      gradient: "from-green-primary to-green-secondary",
      active: true
    },
    {
      title: "Bill Payment Bonus",
      description: "Extra 5% cashback on all utility bill payments",
      validity: "Valid till 15th Jan 2025",
      code: "BILL5",
      discount: "5%",
      gradient: "from-green-secondary to-green-accent",
      active: true
    },
    {
      title: "First Time User",
      description: "Special ₹50 cashback for new users",
      validity: "Valid for 30 days",
      code: "WELCOME50",
      discount: "₹50",
      gradient: "from-green-accent to-green-light",
      active: false
    },
    {
      title: "Weekend Special",
      description: "Double rewards on weekends for DTH recharge",
      validity: "Every Saturday & Sunday",
      code: "WEEKEND2X",
      discount: "2X",
      gradient: "from-green-primary via-green-secondary to-green-accent",
      active: true
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Offers & Rewards" />
      
      <div className="p-4 space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-primary mb-2">Amazing Offers</h2>
          <p className="text-muted-foreground">Save more with every recharge and bill payment</p>
        </div>

        {offers.map((offer, index) => (
          <Card 
            key={index}
            className={`p-6 bg-gradient-to-r ${offer.gradient} text-white animate-fade-in green-shadow`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-bold text-lg">{offer.title}</h3>
                  <div className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {offer.discount} OFF
                  </div>
                </div>
                <p className="text-white/90 text-sm mb-3">{offer.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-white/80">
                  <div className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{offer.validity}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Settings size={12} />
                    <span>Code: {offer.code}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs ${
                offer.active 
                  ? "bg-white/20 text-white" 
                  : "bg-gray-500/20 text-white/60"
              }`}>
                {offer.active ? (
                  <>
                    <Check size={12} />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <Clock size={12} />
                    <span>Used</span>
                  </>
                )}
              </div>
              
              <Button 
                size="sm" 
                variant="secondary"
                className={`text-xs ${
                  offer.active 
                    ? "bg-white/20 hover:bg-white/30 text-white border-white/30" 
                    : "bg-gray-500/20 text-white/60 border-gray-500/30 cursor-not-allowed"
                }`}
                disabled={!offer.active}
              >
                {offer.active ? "Use Offer" : "Used"}
              </Button>
            </div>
          </Card>
        ))}

        <Card className="p-6 text-center bg-green-light border-green-accent">
          <div className="mb-4">
            <Settings className="w-12 h-12 text-green-primary mx-auto mb-3" />
            <h3 className="font-bold text-green-primary mb-2">Refer & Earn</h3>
            <p className="text-muted-foreground text-sm">
              Invite friends and earn ₹25 for each successful referral
            </p>
          </div>
          <Button className="green-gradient text-white">
            Share Referral Code
          </Button>
        </Card>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Offers;
