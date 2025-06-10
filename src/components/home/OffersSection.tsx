
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OffersSection = () => {
  const offers = [
    {
      title: "Cashback Offer",
      description: "Get ₹50 cashback on mobile recharge above ₹199",
      validity: "Valid till 31st Dec",
      gradient: "from-green-primary to-green-secondary"
    },
    {
      title: "Bill Payment Bonus",
      description: "Extra 2% cashback on electricity bill payments",
      validity: "Limited time offer",
      gradient: "from-green-secondary to-green-accent"
    }
  ];

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-green-primary">Offers & Rewards</h2>
        <Button variant="ghost" size="sm" className="text-green-secondary">
          View All
        </Button>
      </div>
      
      <div className="space-y-3">
        {offers.map((offer, index) => (
          <Card 
            key={index}
            className={`p-4 bg-gradient-to-r ${offer.gradient} text-white animate-fade-in`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">{offer.title}</h3>
                <p className="text-white/90 text-xs mb-2">{offer.description}</p>
                <p className="text-white/80 text-xs">{offer.validity}</p>
              </div>
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Claim
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OffersSection;
