
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import History from "./pages/History";
import Wallet from "./pages/Wallet";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Check for repeat recharge data
    const repeatData = sessionStorage.getItem('repeatRechargeData');
    if (repeatData && window.location.search.includes('repeat=true')) {
      // This will be handled by the Home component
      sessionStorage.removeItem('repeatRechargeData');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/history" element={<History />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
