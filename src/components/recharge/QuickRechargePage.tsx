
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowLeft } from "lucide-react";
import { detectOperator, operators } from "@/utils/operatorDetection";
import { WalletManager } from "@/utils/walletManager";

interface QuickRechargePageProps {
  onBack: () => void;
  onSuccess: (rechargeData: any) => void;
}

const QuickRechargePage = ({ onBack, onSuccess }: QuickRechargePageProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [operator, setOperator] = useState("");
  const { toast } = useToast();

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

    const totalAmount = parseFloat(amount);
    const commission = totalAmount * 0.02;
    const rechargeAmount = totalAmount - commission;

    const walletResult = WalletManager.deductMoney(totalAmount, `${operator} Recharge - ${phoneNumber.slice(-4)}`);
    
    if (!walletResult.success) {
      toast({
        title: "Insufficient Balance",
        description: `Your wallet balance is insufficient. Please add money to wallet.`,
        variant: "destructive"
      });
      return;
    }

    const rechargeData = {
      id: `TXN${Date.now()}`,
      type: "Mobile Recharge",
      operator,
      number: `****${phoneNumber.slice(-4)}`,
      amount: rechargeAmount,
      commission,
      totalAmount,
      status: "Success",
      date: new Date().toISOString().split('T')[0],
      fullNumber: phoneNumber,
      canComplain: true,
      canRepeat: true
    };

    toast({
      title: "Recharge Initiated",
      description: `Processing ₹${rechargeAmount.toFixed(2)} recharge for ${operator}...`,
    });

    setTimeout(() => {
      onSuccess(rechargeData);
      toast({
        title: "Recharge Successful",
        description: `₹${rechargeAmount.toFixed(2)} recharged successfully! Wallet balance updated.`,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-50">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold text-green-primary">Quick Recharge</h1>
        </div>
      </div>

      {/* Content */}
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
            />
            <div className="flex items-center space-x-2">
              <Check size={20} className="text-green-primary" />
              <p className="text-green-primary font-medium">
                Detected Operator: {operator}
              </p>
            </div>
          </div>
        )}

        {phoneNumber.length === 10 && operator === "Unknown" && (
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-red-600 font-medium">
              Operator not detected for this number
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
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span>₹{amount}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Commission (2%):</span>
              <span>-₹{(parseFloat(amount || "0") * 0.02).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Recharge Amount:</span>
              <span>₹{(parseFloat(amount || "0") * 0.98).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-blue-600">
              <span>Wallet Balance:</span>
              <span>₹{WalletManager.getBalance().toFixed(2)}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleRecharge}
          className="w-full green-gradient text-white h-12 text-lg"
          disabled={!phoneNumber || phoneNumber.length !== 10 || !amount || operator === "Unknown" || !operator}
        >
          Recharge Now
        </Button>
      </div>
    </div>
  );
};

export default QuickRechargePage;
