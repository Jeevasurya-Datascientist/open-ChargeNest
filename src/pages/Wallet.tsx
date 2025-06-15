
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import WalletBalance from "@/components/ui/wallet-balance";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WalletManager, WalletTransaction } from "@/utils/walletManager";
import { Plus, Send, Clock, TrendingUp } from "lucide-react";
import AddMoneyPage from "@/components/wallet/AddMoneyPage";
import TransferPage from "@/components/wallet/TransferPage";

const Wallet = () => {
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  // Load transactions on component mount
  React.useEffect(() => {
    const walletTransactions = WalletManager.getTransactions();
    setTransactions(walletTransactions);
  }, []);

  if (showAddMoney) {
    return (
      <AddMoneyPage
        onBack={() => setShowAddMoney(false)}
        onSuccess={(amount) => {
          console.log('Money added:', amount);
          setShowAddMoney(false);
        }}
      />
    );
  }

  if (showTransfer) {
    return (
      <TransferPage
        onBack={() => setShowTransfer(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <div className="space-y-6">
        <WalletBalance 
          onAddMoney={() => setShowAddMoney(true)}
          onTransfer={() => setShowTransfer(true)}
        />
        
        {/* Quick Actions */}
        <div className="px-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => setShowAddMoney(true)}
                className="flex items-center justify-center space-x-2 green-gradient text-white"
              >
                <Plus size={20} />
                <span>Add Money</span>
              </Button>
              <Button 
                onClick={() => setShowTransfer(true)}
                variant="outline"
                className="flex items-center justify-center space-x-2"
              >
                <Send size={20} />
                <span>Transfer</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <div className="px-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center space-x-2">
              <Clock size={20} />
              <span>Recent Transactions</span>
            </h3>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <TrendingUp size={16} className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'} />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{new Date(transaction.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                      </p>
                      <p className="text-xs text-gray-500">Balance: ₹{transaction.balanceAfter}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No transactions yet</p>
            )}
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Wallet;
