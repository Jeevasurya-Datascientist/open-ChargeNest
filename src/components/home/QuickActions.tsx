
import { Phone, Settings, Wallet, Clock } from "lucide-react";
import ServiceCard from "@/components/ui/service-card";
import { RechargeManager } from "@/utils/rechargeManager";

interface QuickActionsProps {
  onQuickRecharge?: () => void;
  onAddMoney?: () => void;
  onBillPayment?: () => void;
  onRecentTransactions?: () => void;
}

const QuickActions = ({ onQuickRecharge, onAddMoney, onBillPayment, onRecentTransactions }: QuickActionsProps) => {
  const lastRecharge = RechargeManager.getLastRecharge();
  
  const quickActions = [
    { 
      icon: Phone, 
      title: "Quick Recharge", 
      subtitle: lastRecharge ? `Last: ${lastRecharge.operator} ****${lastRecharge.phoneNumber.slice(-4)}` : "Recharge mobile",
      onClick: onQuickRecharge
    },
    { 
      icon: Settings, 
      title: "Bill Payment", 
      subtitle: "Electricity, Gas",
      onClick: onBillPayment
    },
    { 
      icon: Wallet, 
      title: "Add Money", 
      subtitle: "To wallet",
      onClick: onAddMoney
    },
    { 
      icon: Clock, 
      title: "Recent", 
      subtitle: "View history",
      onClick: onRecentTransactions
    },
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
            onClick={action.onClick}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
