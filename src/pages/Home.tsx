
import { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import WalletBalance from "@/components/ui/wallet-balance";
import QuickActions from "@/components/home/QuickActions";
import RechargeServices from "@/components/home/RechargeServices";
import OffersSection from "@/components/home/OffersSection";
import QuickRechargeDialog from "@/components/recharge/QuickRechargeDialog";
import MobileRechargeDialog from "@/components/recharge/MobileRechargeDialog";
import BillPaymentDialog from "@/components/bills/BillPaymentDialog";
import ElectricityBillDialog from "@/components/bills/ElectricityBillDialog";
import AddMoneyDialog from "@/components/wallet/AddMoneyDialog";
import TransferDialog from "@/components/wallet/TransferDialog";

const Home = () => {
  const [showQuickRecharge, setShowQuickRecharge] = useState(false);
  const [showMobileRecharge, setShowMobileRecharge] = useState(false);
  const [showBillPayment, setShowBillPayment] = useState(false);
  const [showElectricityBill, setShowElectricityBill] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [billType, setBillType] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  const saveTransactionToHistory = (transactionData: any) => {
    const existingHistory = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    const updatedHistory = [transactionData, ...existingHistory];
    localStorage.setItem('transactionHistory', JSON.stringify(updatedHistory));
  };

  const handleServiceClick = (serviceType: string) => {
    switch (serviceType) {
      case "Mobile":
        setShowMobileRecharge(true);
        break;
      case "Electricity":
        setShowElectricityBill(true);
        break;
      case "DTH":
      case "Gas":
      case "Water":
      case "Broadband":
        setBillType(serviceType);
        setShowBillPayment(true);
        break;
      default:
        break;
    }
  };

  const handleBalanceChange = (newBalance: number) => {
    setWalletBalance(newBalance);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <div className="space-y-6">
        <WalletBalance 
          onAddMoney={() => setShowAddMoney(true)}
          onTransfer={() => setShowTransfer(true)}
          onBalanceChange={handleBalanceChange}
        />
        <QuickActions 
          onQuickRecharge={() => setShowQuickRecharge(true)}
          onAddMoney={() => setShowAddMoney(true)}
        />
        <RechargeServices onServiceClick={handleServiceClick} />
        <OffersSection />
      </div>

      <QuickRechargeDialog
        isOpen={showQuickRecharge}
        onClose={() => setShowQuickRecharge(false)}
        onSuccess={saveTransactionToHistory}
      />

      <MobileRechargeDialog
        isOpen={showMobileRecharge}
        onClose={() => setShowMobileRecharge(false)}
        onSuccess={saveTransactionToHistory}
      />

      <BillPaymentDialog
        isOpen={showBillPayment}
        onClose={() => setShowBillPayment(false)}
        onSuccess={saveTransactionToHistory}
        billType={billType}
      />

      <ElectricityBillDialog
        isOpen={showElectricityBill}
        onClose={() => setShowElectricityBill(false)}
        onSuccess={saveTransactionToHistory}
      />

      <AddMoneyDialog
        isOpen={showAddMoney}
        onClose={() => setShowAddMoney(false)}
        onSuccess={(amount) => {
          console.log('Money added:', amount);
        }}
      />

      <TransferDialog
        isOpen={showTransfer}
        onClose={() => setShowTransfer(false)}
      />

      <BottomNavigation />
    </div>
  );
};

export default Home;
