// src/pages/Login.tsx

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";

// --- UI & Icons ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Loader2 } from "lucide-react";

// --- Logic ---
import { AuthManager } from "@/utils/authManager";

// --- Animation properties ---
const stepAnimationVariants: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
};

const stepAnimationTransition: Transition = {
  duration: 0.3,
  ease: "easeInOut",
};

const titleContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const titleLetterVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
};

const textAnimationVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.5 } },
};

const Login = () => {
  // --- STATE MANAGEMENT ---
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const cyclingTexts = [
    "Enter your phone number to continue",
    "Quick, Secure, and Easy Login",
    "Your one-stop for all recharges"
  ];
  const [textIndex, setTextIndex] = useState(0);

  // --- HOOKS ---
  const { toast } = useToast();
  const navigate = useNavigate();

  // --- EFFECT HOOKS ---
  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex(prevIndex => (prevIndex + 1) % cyclingTexts.length);
    }, 10000); 

    return () => clearInterval(textInterval);
  }, [cyclingTexts.length]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // --- UTILITY & VALIDATION ---
  const validatePhoneNumber = (num: string) => {
    if (!num) {
      setPhoneError("Phone number is required.");
      return false;
    }
    if (!/^\d{10}$/.test(num)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handlePhoneNumberChange = (value: string) => {
    const sanitizedValue = value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(sanitizedValue);
    validatePhoneNumber(sanitizedValue);
  };

  const startCountdown = () => setCountdown(30);

  // --- AUTHENTICATION HANDLERS ---
  const handleContinue = async () => {
    if (!validatePhoneNumber(phoneNumber) || isLoading) return;

    setIsLoading(true);

    if (AuthManager.isAdminPhone(phoneNumber)) {
      setIsVerifyingAdmin(true);
      setStep(2);
      toast({ title: "Admin Detected", description: "Please enter your password to continue." });
    } else {
      setIsVerifyingAdmin(false);
      const { success, error } = await AuthManager.generateOTP(phoneNumber);
      if (success) {
        toast({ title: "OTP Sent", description: `An OTP has been sent to +91 ${phoneNumber}` });
        setStep(2);
        startCountdown();
      } else {
        toast({ title: "Failed to send OTP", description: error || "An unknown error occurred.", variant: "destructive" });
      }
    }
    setIsLoading(false);
  };
  
  const handleResendOTP = async () => {
    if (isResending || countdown > 0) return;
    
    setIsResending(true);
    const { success, error } = await AuthManager.generateOTP(phoneNumber);
    setIsResending(false);
    
    if (success) {
      toast({ title: "OTP Resent Successfully", description: `A new OTP was sent to +91 ${phoneNumber}` });
      startCountdown();
    } else {
      toast({ title: "Failed to resend OTP", description: error || "An unknown error occurred.", variant: "destructive" });
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({ title: "Invalid OTP", description: "Please enter the 6-digit OTP.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    const { success, error } = await AuthManager.validateOTP(phoneNumber, otp);

    if (success) {
      AuthManager.setUserSession(phoneNumber);
      toast({ title: "Login Successful!", description: "Welcome to Charge Nest." });
      setTimeout(() => navigate("/", { replace: true }), 300);
    } else {
      toast({ title: "OTP Verification Failed", description: error || "The OTP you entered is incorrect.", variant: "destructive" });
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!password) {
        setPasswordError("Password is required.");
        return;
    }
    setPasswordError(null);
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (AuthManager.validateAdmin(phoneNumber, password)) {
        AuthManager.setAdminSession(phoneNumber);
        toast({ title: "Admin Login Successful!", description: "Redirecting to the admin panel." });
        
        // FIX: Navigate to the lowercase path, which is the standard convention for routes.
        // Use { replace: true } to remove the login page from browser history.
        setTimeout(() => {
            navigate("/admin", { replace: true });
        }, 500);

    } else {
        setPasswordError("Invalid password. Please try again.");
        toast({ title: "Login Failed", description: "The password you entered is incorrect.", variant: "destructive" });
        setIsLoading(false);
    }
  }

  const goBack = () => {
    setStep(1);
    setOtp("");
    setPassword("");
    setPasswordError(null);
    setIsVerifyingAdmin(false);
    setCountdown(0);
  };

  const appNamePart1 = "Charge";
  const appNamePart2 = "Nest";

  return (
    <div className="min-h-screen bg-[#F7FEF7] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="w-full max-w-sm border-gray-200 shadow-lg shadow-green-100/50 rounded-2xl">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" variants={stepAnimationVariants} initial="initial" animate="animate" exit="exit" transition={stepAnimationTransition}>
                  <div className="flex justify-center mb-3">
                    <img src="/icon.png" alt="ChargeNest Icon" className="w-24 h-24" />
                  </div>
                  <motion.h1 className="flex justify-center text-4xl font-bold mb-3" variants={titleContainerVariants} initial="hidden" animate="visible">
                    {Array.from(appNamePart1).map((letter, index) => (<motion.span key={`charge-${index}`} variants={titleLetterVariants} className="text-orange-500">{letter}</motion.span>))}
                    {Array.from(appNamePart2).map((letter, index) => (<motion.span key={`nest-${index}`} variants={titleLetterVariants} className="text-teal-600">{letter}</motion.span>))}
                  </motion.h1>
                  <div className="h-8 text-center mb-6">
                    <AnimatePresence mode="wait">
                      <motion.p key={textIndex} variants={textAnimationVariants} initial="initial" animate="animate" exit="exit" className="text-gray-500">{cyclingTexts[textIndex]}</motion.p>
                    </AnimatePresence>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone-number" className="font-semibold text-green-800">Phone Number</Label>
                      <div className="flex items-center mt-2 w-full rounded-lg border bg-green-50/50 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500">
                        <span className="px-4 text-gray-500 border-r">+91</span>
                        <Input id="phone-number" type="tel" placeholder="Enter here..." value={phoneNumber} onChange={(e) => handlePhoneNumberChange(e.target.value)} className="pl-4 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"/>
                      </div>
                      {phoneError && phoneNumber && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                    </div>
                    <p className="text-xs text-center text-gray-500 px-2 !mt-2">By clicking Continue, you agree to our{' '}<Link to="/terms-and-conditions" className="font-semibold text-green-700 hover:underline">Terms & Conditions</Link> and{' '}<Link to="/privacy-policy" className="font-semibold text-green-700 hover:underline">Privacy Policy</Link>.</p>
                    <Button onClick={handleContinue} className="w-full bg-green-600 hover:bg-green-700 text-white text-base py-6" disabled={isLoading || !!phoneError}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isLoading ? "Please wait..." : "Continue"}
                    </Button>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" variants={stepAnimationVariants} initial="initial" animate="animate" exit="exit" transition={stepAnimationTransition}>
                  {isVerifyingAdmin ? (
                    <div className="space-y-6">
                      <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-green-800">Admin Login</h1>
                        <p className="text-gray-500 mt-2">Enter your password for <br /><b className="text-gray-700">+91 {phoneNumber}</b></p>
                      </div>
                      <div>
                        <Label htmlFor="password" className="font-semibold text-green-800">Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(null); }} placeholder="Enter your password" className="mt-2" />
                        {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                      </div>
                      <Button onClick={handleAdminLogin} className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading || !password}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? 'Verifying...' : 'Log In'}
                      </Button>
                      <Button variant="link" onClick={goBack} className="w-full text-green-700">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Change Number
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-green-800">Enter OTP</h1>
                        <p className="text-gray-500 mt-2">A 6-digit code was sent to <br /><b className="text-gray-700">+91 {phoneNumber}</b></p>
                      </div>
                      <div className="space-y-6">
                        <div className="flex justify-center">
                          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                            <InputOTPGroup>{[...Array(6)].map((_, i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup>
                          </InputOTP>
                        </div>
                        <div className="text-center text-sm">
                          {countdown > 0 ? (<p className="text-muted-foreground">Resend OTP in {countdown}s</p>) : (
                            <Button variant="link" className="text-green-700 p-0 h-auto" onClick={handleResendOTP} disabled={isResending}>
                              {isResending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Resend OTP
                            </Button>
                          )}
                        </div>
                        <Button onClick={handleVerifyOTP} className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading || otp.length !== 6}>
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Verify OTP
                        </Button>
                        <Button variant="link" onClick={goBack} className="w-full text-green-700">
                           <ArrowLeft className="h-4 w-4 mr-2" /> Change Number
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="justify-center py-4">
            <p className="text-sm text-muted-foreground">Don't have an account?{' '}<Link to="/register" className="font-semibold text-green-700 hover:underline">Register</Link></p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;