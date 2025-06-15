
import { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import WalletBalance from "@/components/ui/wallet-balance";
import QuickActions from "@/components/home/QuickActions";
import RechargeServices from "@/components/home/RechargeServices";
import OffersSection from "@/components/home/OffersSection";
import QuickRechargePage from "@/components/recharge/QuickRechargePage";
import MobileRechargeDialog from "@/components/recharge/MobileRechargeDialog";
import BillPaymentPage from "@/components/bills/BillPaymentPage";
import ElectricityBillPage from "@/components/bills/ElectricityBillPage";
import AddMoneyPage from "@/components/wallet/AddMoneyPage";
import TransferPage from "@/components/wallet/TransferPage";

const Home = () => {
  const [showQuickRecharge, setShowQuickRecharge] = useState(false);
  const [showMobileRecharge, setShowMobileRecharge] = useState(false);
  const [showBillPayment, setShowBillPayment] = useState(false);
  const [showElectricityBill, setShowElectricityBill] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [billType, setBillType] = useState("");
  const [rechargeData, setRechargeData] = useState<any>(null);

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

  const handleQuickRecharge = (data?: any) => {
    if (data) {
      setRechargeData(data);
    }
    setShowQuickRecharge(true);
  };

  const handleBillPayment = () => {
    setBillType("General");
    setShowBillPayment(true);
  };

  const handleRecentTransactions = () => {
    window.location.href = "/history";
  };

  // If any full page is shown, render that instead
  if (showQuickRecharge) {
    return (
      <QuickRechargePage
        onBack={() => {
          setShowQuickRecharge(false);
          setRechargeData(null);
        }}
        onSuccess={(data) => {
          saveTransactionToHistory(data);
          setShowQuickRecharge(false);
          setRechargeData(null);
        }}
        prefilledData={rechargeData}
      />
    );
  }

  if (showBillPayment) {
    return (
      <BillPaymentPage
        onBack={() => setShowBillPayment(false)}
        onSuccess={(data) => {
          saveTransactionToHistory(data);
          setShowBillPayment(false);
        }}
        billType={billType}
      />
    );
  }

  if (showElectricityBill) {
    return (
      <ElectricityBillPage
        onBack={() => setShowElectricityBill(false)}
        onSuccess={(data) => {
          saveTransactionToHistory(data);
          setShowElectricityBill(false);
        }}
      />
    );
  }

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
        <QuickActions 
          onQuickRecharge={() => handleQuickRecharge()}
          onAddMoney={() => setShowAddMoney(true)}
          onBillPayment={handleBillPayment}
          onRecentTransactions={handleRecentTransactions}
        />
        <RechargeServices onServiceClick={handleServiceClick} />
        <OffersSection />
      </div>

      <MobileRechargeDialog
        isOpen={showMobileRecharge}
        onClose={() => setShowMobileRecharge(false)}
        onSuccess={saveTransactionToHistory}
      />

      <BottomNavigation />
    </div>
  );
};

export default Home;
