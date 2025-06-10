
import { Phone, Settings, Bell, Wallet, Calendar, Search } from "lucide-react";
import ServiceCard from "@/components/ui/service-card";

const RechargeServices = () => {
  const services = [
    { icon: Phone, title: "Mobile", subtitle: "All operators", color: "primary" },
    { icon: Settings, title: "DTH", subtitle: "Tata Sky, Dish TV", color: "secondary" },
    { icon: Bell, title: "Electricity", subtitle: "All states", color: "accent" },
    { icon: Wallet, title: "Gas", subtitle: "Book cylinder", color: "primary" },
    { icon: Calendar, title: "Water", subtitle: "Municipal bills", color: "secondary" },
    { icon: Search, title: "Broadband", subtitle: "Internet bills", color: "accent" },
    { icon: Settings, title: "Metro", subtitle: "Smart cards", color: "primary" },
    { icon: Phone, title: "FASTag", subtitle: "Toll payments", color: "secondary" },
  ];

  return (
    <div className="px-4 mb-6">
      <h2 className="text-lg font-bold text-green-primary mb-3">Recharge & Bill Payment</h2>
      <div className="grid grid-cols-2 gap-3">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            icon={service.icon}
            title={service.title}
            subtitle={service.subtitle}
            gradient={index % 3 === 0}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default RechargeServices;
