
import { Phone, Settings, Wallet, Clock } from "lucide-react";
import ServiceCard from "@/components/ui/service-card";

const QuickActions = () => {
  const quickActions = [
    { icon: Phone, title: "Quick Recharge", subtitle: "Last: Jio ****1234" },
    { icon: Settings, title: "Bill Payment", subtitle: "Electricity, Gas" },
    { icon: Wallet, title: "Add Money", subtitle: "To wallet" },
    { icon: Clock, title: "Recent", subtitle: "View history" },
  ];

  return (
    <div className="px-4 mb-6">
      <h2 className="text-lg font-bold text-green-primary mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <ServiceCard
            key={index}
            icon={action.icon}
            title={action.title}
            subtitle={action.subtitle}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
