import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, UserPlus } from "lucide-react";
import { AuthManager } from "@/utils/authManager";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: ""
  });
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendOTP = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Missing Name",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return;
    }

    if (!formData.phoneNumber || formData.phoneNumber.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    if (!formData.email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
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

    setIsLoading(true);
    
    try {
      const result = await AuthManager.generateOTP(formData.phoneNumber);
      setIsLoading(false);
      
      if (result.success) {
        setStep(2);
        toast({
          title: "OTP Sent",
          description: `OTP sent to +91 ${formData.phoneNumber} via SMS`,
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
      const result = await AuthManager.validateOTP(formData.phoneNumber, otp);
      setIsLoading(false);
      
      if (result.success) {
        AuthManager.setUserSession(formData.phoneNumber);
        toast({
          title: "Registration Successful",
          description: "Welcome to AnyPay Hub!",
        });
        navigate("/");
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
    setStep(1);
    setOtp("");
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const result = await AuthManager.generateOTP(formData.phoneNumber);
      setIsLoading(false);
      
      if (result.success) {
        toast({
          title: "OTP Resent",
          description: `New OTP sent to +91 ${formData.phoneNumber} via SMS`,
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
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-green-primary">Join AnyPay Hub</h1>
          <p className="text-muted-foreground">
            {step === 1 ? "Create your account to get started" : "Enter the OTP sent to your phone"}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1"
              />
            </div>

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
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value.replace(/\D/g, '').slice(0, 10))}
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
              disabled={isLoading || !formData.name.trim() || formData.phoneNumber.length !== 10 || !formData.email.includes("@") || !acceptedTerms}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </Button>

            <div className="text-center">
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-green-primary hover:underline"
              >
                Already have an account? Login
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
              Back to Details
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              OTP sent to +91 {formData.phoneNumber}
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
              {isLoading ? "Creating Account..." : "Create Account"}
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

export default Register;
