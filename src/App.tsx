// src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// --- 1. IMPORT THE USERPROVIDER ---
import { UserProvider } from "./hooks/useUser"; // Make sure the path is correct

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
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RealtimeNotificationListener from "./components/auth/RealtimeNotificationListener";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const repeatData = sessionStorage.getItem('repeatRechargeData');
    if (repeatData && window.location.search.includes('repeat=true')) {
      sessionStorage.removeItem('repeatRechargeData');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* --- 2. WRAP YOUR APP WITH THE PROVIDER --- */}
        <UserProvider>
          <BrowserRouter>
            <RealtimeNotificationListener />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
              <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              
              <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminPanel /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;