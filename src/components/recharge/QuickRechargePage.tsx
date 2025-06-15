
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowLeft, CreditCard } from "lucide-react";
import { detectOperator, operators } from "@/utils/operatorDetection";
import { WalletManager } from "@/utils/walletManager";
import { RechargeManager } from "@/utils/rechargeManager";

interface QuickRechargePageProps {
  onBack: () => void;
  onSuccess: (rechargeData: any) => void;
  prefilledData?: any;
}

const QuickRechargePage = ({ onBack, onSuccess, prefilledData }: QuickRechargePageProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [operator, setOperator] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (prefilledData) {
      setPhoneNumber(prefilledData.fullNumber || "");
      setAmount(prefilledData.amount?.toString() || "");
      if (prefilledData.fullNumber) {
        const detectedOperator = detectOperator(prefilledData.fullNumber);
        setOperator(detectedOperator);
      }
    }
  }, [prefilledData]);

  useEffect(() => {
    if (phoneNumber.length === 10) {
      const timeUntilNext = RechargeManager.getTimeUntilNextRecharge(phoneNumber);
      setTimeRemaining(timeUntilNext);
      
      if (timeUntilNext > 0) {
        const timer = setInterval(() => {
          const remaining = RechargeManager.getTimeUntilNextRecharge(phoneNumber);
          setTimeRemaining(remaining);
          if (remaining <= 0) {
            clearInterval(timer);
          }
        }, 1000);
        
        return () => clearInterval(timer);
      }
    }
  }, [phoneNumber]);

  const handlePhoneChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(numericValue);
    
    if (numericValue.length === 10) {
      const detectedOperator = detectOperator(numericValue);
      setOperator(detectedOperator);
    } else {
      setOperator("");
    }
  };

  const handleRecharge = () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid recharge amount",
        variant: "destructive"
      });
      return;
    }

    if (operator === "Unknown" || !operator) {
      toast({
        title: "Operator Not Detected",
        description: "Could not detect operator for this number",
        variant: "destructive"
      });
      return;
    }

    if (!RechargeManager.canRepeatRecharge(phoneNumber)) {
      const timeLeft = Math.ceil(timeRemaining / 1000 / 60);
      toast({
        title: "Recharge Limit",
        description: `Please wait ${timeLeft} minute(s) before recharging this number again`,
        variant: "destructive"
      });
      return;
    }

    const totalAmount = parseFloat(amount);
    const commission = totalAmount * 0.02;
    const currentBalance = WalletManager.getBalance();

    setIsProcessing(true);

    if (currentBalance >= totalAmount) {
      const walletResult = WalletManager.deductMoney(totalAmount, `${operator} Recharge - ${phoneNumber.slice(-4)}`);
      
      if (walletResult.success) {
        processRecharge(totalAmount, commission, "Wallet");
      }
    } else {
      toast({
        title: "Insufficient Wallet Balance",
        description: `Redirecting to UPI for ₹${totalAmount} payment...`,
      });

      setTimeout(() => {
        processRecharge(totalAmount, commission, "UPI");
      }, 3000);
    }
  };

  const processRecharge = (totalAmount: number, commission: number, paymentMethod: string) => {
    RechargeManager.recordRecharge(phoneNumber, operator, totalAmount);
    
    const rechargeData = {
      id: `TXN${Date.now()}`,
      type: "Mobile Recharge",
      operator,
      number: `****${phoneNumber.slice(-4)}`,
      amount: totalAmount,
      commission,
      status: "Success",
      date: new Date().toISOString().split('T')[0],
      fullNumber: phoneNumber,
      paymentMethod,
      canComplain: true,
      canRepeat: true
    };

    setTimeout(() => {
      onSuccess(rechargeData);
      setIsProcessing(false);
      toast({
        title: "Recharge Successful",
        description: `₹${totalAmount} recharged successfully via ${paymentMethod}!`,
      });
    }, 2000);
  };

  const currentBalance = WalletManager.getBalance();
  const totalAmount = parseFloat(amount || "0");
  const commission = totalAmount * 0.02;
  const willUseUPI = currentBalance < totalAmount && totalAmount > 0;
  const canRecharge = RechargeManager.canRepeatRecharge(phoneNumber);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-white border-b z-50">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold text-green-primary">Quick Recharge</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter 10-digit phone number"
            value={phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            maxLength={10}
            className="mt-2 h-12 text-lg"
          />
        </div>
        
        {phoneNumber.length === 10 && operator && operator !== "Unknown" && (
          <div className="p-4 bg-green-light rounded-lg flex items-center space-x-3">
            <img 
              src={operators[operator].logo} 
              alt={operator}
              className="w-10 h-10 rounded"
              onError={(e) => {
                e.currentTarget.src = "/logos/default.png";
              }}
            />
            <div className="flex items-center space-x-2">
              <Check size={20} className="text-green-primary" />
              <p className="text-green-primary font-medium">
                Detected Operator: {operator}
              </p>
            </div>
          </div>
        )}

        {!canRecharge && timeRemaining > 0 && (
          <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <p className="text-yellow-800 text-sm">
              Please wait {Math.ceil(timeRemaining / 1000 / 60)} minute(s) before recharging this number again
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="recharge-amount">Recharge Amount</Label>
          <Input
            id="recharge-amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-2 h-12 text-lg"
          />
        </div>

        {amount && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between font-medium">
              <span>Recharge Amount:</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between font-medium text-blue-600">
              <span>Wallet Balance:</span>
              <span>₹{currentBalance.toFixed(2)}</span>
            </div>
            {willUseUPI && (
              <div className="flex justify-between font-medium text-orange-600">
                <span>Payment Method:</span>
                <div className="flex items-center space-x-1">
                  <CreditCard size={16} />
                  <span>UPI Payment</span>
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleRecharge}
          className="w-full green-gradient text-white h-12 text-lg"
          disabled={!phoneNumber || phoneNumber.length !== 10 || !amount || operator === "Unknown" || !operator || isProcessing || !canRecharge}
        >
          {isProcessing ? "Processing..." : willUseUPI ? "Pay via UPI" : "Recharge Now"}
        </Button>
      </div>
    </div>
  );
};

export default QuickRechargePage;
