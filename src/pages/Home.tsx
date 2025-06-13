import { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import WalletBalance from "@/components/ui/wallet-balance";
import QuickActions from "@/components/home/QuickActions";
import RechargeServices from "@/components/home/RechargeServices";
import OffersSection from "@/components/home/OffersSection";
import AddMoneyDialog from "@/components/wallet/AddMoneyDialog";
import QuickRechargeDialog from "@/components/recharge/QuickRechargeDialog";
import MobileRechargeDialog from "@/components/recharge/MobileRechargeDialog";
import BillPaymentDialog from "@/components/bills/BillPaymentDialog";
import ElectricityBillDialog from "@/components/bills/ElectricityBillDialog";

const Home = () => {
  const [walletBalance, setWalletBalance] = useState(2450);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showQuickRecharge, setShowQuickRecharge] = useState(false);
  const [showMobileRecharge, setShowMobileRecharge] = useState(false);
  const [showBillPayment, setShowBillPayment] = useState(false);
  const [showElectricityBill, setShowElectricityBill] = useState(false);
  const [billType, setBillType] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  const handleAddMoney = (amount: number) => {
    setWalletBalance(prev => prev + amount);
    const transaction = {
      id: `TXN${Date.now()}`,
      type: "Credit",
      amount,
      description: "Added to wallet",
      time: "Just now",
      status: "Success",
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleRecharge = (rechargeData: any) => {
    setWalletBalance(prev => prev - rechargeData.totalAmount);
    setTransactions(prev => [rechargeData, ...prev]);
  };

  const handleBillPayment = (billData: any) => {
    setWalletBalance(prev => prev - billData.totalAmount);
    setTransactions(prev => [billData, ...prev]);
  };

  const handleServiceClick = (serviceType: string) => {
    if (serviceType === "Quick Recharge") {
      setShowQuickRecharge(true);
    } else if (serviceType === "Mobile") {
      setShowMobileRecharge(true);
    } else if (serviceType === "Electricity") {
      setShowElectricityBill(true);
    } else if (["DTH", "Gas", "Water", "Broadband"].includes(serviceType)) {
      setBillType(serviceType);
      setShowBillPayment(true);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <div className="pt-4">
        <WalletBalance 
          balance={walletBalance} 
          onAddMoney={() => setShowAddMoney(true)}
        />
        <QuickActions 
          onQuickRecharge={() => setShowQuickRecharge(true)}
          onAddMoney={() => setShowAddMoney(true)}
        />
        <RechargeServices onServiceClick={handleServiceClick} />
        <OffersSection />
      </div>
      
      <AddMoneyDialog
        isOpen={showAddMoney}
        onClose={() => setShowAddMoney(false)}
        onSuccess={handleAddMoney}
      />
      
      <QuickRechargeDialog
        isOpen={showQuickRecharge}
        onClose={() => setShowQuickRecharge(false)}
        onSuccess={handleRecharge}
      />
      
      <MobileRechargeDialog
        isOpen={showMobileRecharge}
        onClose={() => setShowMobileRecharge(false)}
        onSuccess={handleRecharge}
      />
      
      <ElectricityBillDialog
        isOpen={showElectricityBill}
        onClose={() => setShowElectricityBill(false)}
        onSuccess={handleBillPayment}
      />
      
      <BillPaymentDialog
        isOpen={showBillPayment}
        onClose={() => setShowBillPayment(false)}
        onSuccess={handleBillPayment}
        billType={billType}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
