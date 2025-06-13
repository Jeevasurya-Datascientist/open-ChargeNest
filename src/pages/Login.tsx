
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Smartphone } from "lucide-react";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOTP = () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      toast({
        title: "OTP Sent",
        description: `OTP sent to +91 ${phoneNumber}`,
      });
    }, 2000);
  };

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      if (otp === "123456") { // Mock OTP
        toast({
          title: "Login Successful",
          description: "Welcome to GreenCharge!",
        });
        navigate("/");
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check the OTP and try again",
          variant: "destructive"
        });
      }
    }, 2000);
  };

  const goBack = () => {
    setStep(1);
    setOtp("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-green-gradient rounded-full flex items-center justify-center">
            <Smartphone className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-green-primary">GreenCharge</h1>
          <p className="text-muted-foreground">
            {step === 1 ? "Enter your phone number to continue" : "Enter the OTP sent to your phone"}
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

            <Button
              onClick={handleSendOTP}
              className="w-full green-gradient text-white"
              disabled={isLoading || phoneNumber.length !== 10}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
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

        {step === 2 && (
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
                onClick={handleSendOTP}
                className="text-sm text-green-primary hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;
