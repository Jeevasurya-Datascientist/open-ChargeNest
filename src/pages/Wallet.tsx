
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import WalletBalance from "@/components/ui/wallet-balance";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Clock, Settings } from "lucide-react";

const Wallet = () => {
  const recentTransactions = [
    { type: "Credit", amount: 500, description: "Added to wallet", time: "2 hours ago", icon: ArrowUp },
    { type: "Debit", amount: 199, description: "Mobile recharge", time: "1 day ago", icon: ArrowDown },
    { type: "Credit", amount: 50, description: "Cashback received", time: "2 days ago", icon: ArrowUp },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="My Wallet" />
      
      <div className="pt-4">
        <WalletBalance balance={2450} />
        
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <Button className="green-gradient text-white h-12">
              Add Money
            </Button>
            <Button variant="outline" className="green-border text-green-primary h-12">
              Send Money
            </Button>
          </div>
        </div>

        <div className="px-4 mb-6">
          <h2 className="text-lg font-bold text-green-primary mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <Settings className="w-6 h-6 text-green-primary mx-auto mb-2" />
              <span className="text-xs text-muted-foreground">Auto Pay</span>
            </Card>
            <Card className="p-3 text-center">
              <Clock className="w-6 h-6 text-green-primary mx-auto mb-2" />
              <span className="text-xs text-muted-foreground">Scheduled</span>
            </Card>
            <Card className="p-3 text-center">
              <Settings className="w-6 h-6 text-green-primary mx-auto mb-2" />
              <span className="text-xs text-muted-foreground">Settings</span>
            </Card>
          </div>
        </div>

        <div className="px-4">
          <h2 className="text-lg font-bold text-green-primary mb-3">Recent Activity</h2>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <Card key={index} className="p-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === "Credit" ? "bg-green-light" : "bg-red-100"
                  }`}>
                    <transaction.icon 
                      size={16} 
                      className={transaction.type === "Credit" ? "text-green-primary" : "text-red-500"} 
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-foreground">
                        {transaction.description}
                      </span>
                      <span className={`font-bold text-sm ${
                        transaction.type === "Credit" ? "text-green-primary" : "text-red-500"
                      }`}>
                        {transaction.type === "Credit" ? "+" : "-"}₹{transaction.amount}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{transaction.time}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Wallet;
