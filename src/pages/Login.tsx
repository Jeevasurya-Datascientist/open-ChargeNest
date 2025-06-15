
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Smartphone, Shield } from "lucide-react";
import { AuthManager } from "@/utils/authManager";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Phone, 2: Password (for admin), 3: OTP
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    if (!acceptedTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the Terms and Conditions and Privacy Policy",
        variant: "destructive"
      });
      return;
    }

    const isAdmin = AuthManager.isAdminPhone(phoneNumber);
    
    if (isAdmin) {
      setIsAdminLogin(true);
      setStep(2); // Go to password step for admin
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await AuthManager.generateOTP(phoneNumber);
      setIsLoading(false);
      
      if (result.success) {
        setStep(3);
        toast({
          title: "OTP Sent",
          description: `OTP sent to +91 ${phoneNumber} via SMS`,
        });
      } else {
        toast({
          title: "Failed to Send OTP",
          description: result.error || "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAdminPasswordVerification = async () => {
    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter your admin password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      if (AuthManager.validateAdmin(phoneNumber, password)) {
        try {
          const result = await AuthManager.generateOTP(phoneNumber);
          setIsLoading(false);
          
          if (result.success) {
            setStep(3);
            toast({
              title: "Password Verified",
              description: `OTP sent to +91 ${phoneNumber} via SMS`,
            });
          } else {
            toast({
              title: "Failed to Send OTP",
              description: result.error || "Please try again",
              variant: "destructive"
            });
          }
        } catch (error) {
          setIsLoading(false);
          toast({
            title: "Error",
            description: "Failed to send OTP. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        setIsLoading(false);
        toast({
          title: "Invalid Password",
          description: "Please check your admin password and try again",
          variant: "destructive"
        });
      }
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthManager.validateOTP(phoneNumber, otp);
      setIsLoading(false);
      
      if (result.success) {
        if (isAdminLogin) {
          AuthManager.setAdminSession(phoneNumber);
          toast({
            title: "Admin Login Successful",
            description: "Welcome to Admin Panel!",
          });
          navigate("/admin");
        } else {
          AuthManager.setUserSession(phoneNumber);
          toast({
            title: "Login Successful",
            description: "Welcome to GreenCharge!",
          });
          navigate("/");
        }
      } else {
        toast({
          title: "Invalid OTP",
          description: result.error || "Please check the OTP and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive"
      });
    }
  };

  const goBack = () => {
    if (step === 3) {
      setStep(isAdminLogin ? 2 : 1);
    } else if (step === 2) {
      setStep(1);
      setIsAdminLogin(false);
      setPassword("");
    }
    setOtp("");
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const result = await AuthManager.generateOTP(phoneNumber);
      setIsLoading(false);
      
      if (result.success) {
        toast({
          title: "OTP Resent",
          description: `New OTP sent to +91 ${phoneNumber} via SMS`,
        });
      } else {
        toast({
          title: "Failed to Resend OTP",
          description: result.error || "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to resend OTP. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-green-gradient rounded-full flex items-center justify-center">
            {isAdminLogin ? (
              <Shield className="h-8 w-8 text-white" />
            ) : (
              <Smartphone className="h-8 w-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-green-primary">
            {isAdminLogin ? "Admin Login" : "GreenCharge"}
          </h1>
          <p className="text-muted-foreground">
            {step === 1 ? "Enter your phone number to continue" : 
             step === 2 ? "Enter your admin password" :
             "Enter the OTP sent to your phone"}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex mt-1">
                <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                  <span className="text-sm text-gray-600">+91</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="rounded-l-none"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                className="mt-1"
              />
              <div className="text-sm leading-5">
                <Label htmlFor="terms" className="cursor-pointer">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/terms-and-conditions")}
                    className="text-green-primary hover:underline"
                  >
                    Terms and Conditions
                  </button>
                  {" "}and{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/privacy-policy")}
                    className="text-green-primary hover:underline"
                  >
                    Privacy Policy
                  </button>
                </Label>
              </div>
            </div>

            <Button
              onClick={handleSendOTP}
              className="w-full green-gradient text-white"
              disabled={isLoading || phoneNumber.length !== 10 || !acceptedTerms}
            >
              {isLoading ? "Processing..." : "Continue"}
            </Button>

            <div className="text-center">
              <button
                onClick={() => navigate("/register")}
                className="text-sm text-green-primary hover:underline"
              >
                Don't have an account? Register
              </button>
            </div>
          </div>
        )}

        {step === 2 && isAdminLogin && (
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={goBack}
              className="p-0 h-auto text-green-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Change Number
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Admin phone: +91 {phoneNumber}
            </div>

            <div>
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleAdminPasswordVerification}
              className="w-full green-gradient text-white"
              disabled={isLoading || !password}
            >
              {isLoading ? "Verifying..." : "Verify Password"}
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Button
              variant="ghost"
              onClick={goBack}
              className="p-0 h-auto text-green-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isAdminLogin ? "Back to Password" : "Change Number"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              OTP sent to +91 {phoneNumber}
            </div>

            <div className="space-y-2">
              <Label>Enter OTP</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button
              onClick={handleVerifyOTP}
              className="w-full green-gradient text-white"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="text-center">
              <button
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-sm text-green-primary hover:underline disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Resend OTP"}
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;
