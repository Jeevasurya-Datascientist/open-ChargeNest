
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import WalletBalance from "@/components/ui/wallet-balance";
import QuickActions from "@/components/home/QuickActions";
import RechargeServices from "@/components/home/RechargeServices";
import OffersSection from "@/components/home/OffersSection";

const Home = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      
      <div className="pt-4">
        <WalletBalance balance={2450} />
        <QuickActions />
        <RechargeServices />
        <OffersSection />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Home;
