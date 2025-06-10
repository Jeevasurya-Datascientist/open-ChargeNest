
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Check, Clock, Phone, Settings } from "lucide-react";

const History = () => {
  const transactions = [
    {
      id: "TXN001",
      type: "Mobile Recharge",
      operator: "Jio",
      number: "****1234",
      amount: 199,
      status: "Success",
      date: "2024-01-10",
      icon: Phone
    },
    {
      id: "TXN002", 
      type: "Electricity Bill",
      operator: "MSEB",
      number: "****5678",
      amount: 850,
      status: "Success",
      date: "2024-01-09",
      icon: Settings
    },
    {
      id: "TXN003",
      type: "DTH Recharge",
      operator: "Tata Sky",
      number: "****9012",
      amount: 299,
      status: "Pending",
      date: "2024-01-08",
      icon: Settings
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Transaction History" />
      
      <div className="p-4 space-y-3">
        {transactions.map((transaction, index) => (
          <Card 
            key={transaction.id}
            className="p-4 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-light rounded-lg">
                <transaction.icon size={20} className="text-green-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm text-green-primary">
                    {transaction.type}
                  </h3>
                  <span className="font-bold text-foreground">
                    ₹{transaction.amount}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {transaction.operator} • {transaction.number}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.date} • {transaction.id}
                    </p>
                  </div>
                  
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    transaction.status === "Success" 
                      ? "bg-green-light text-green-primary" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {transaction.status === "Success" ? (
                      <Check size={12} />
                    ) : (
                      <Clock size={12} />
                    )}
                    <span>{transaction.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default History;
