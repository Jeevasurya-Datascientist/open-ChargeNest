
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, CreditCard } from "lucide-react";
import { detectOperator, operators } from "@/utils/operatorDetection";
import { WalletManager } from "@/utils/walletManager";

interface QuickRechargeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (rechargeData: any) => void;
}

const QuickRechargeDialog = ({ isOpen, onClose, onSuccess }: QuickRechargeDialogProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [operator, setOperator] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
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
      onClose();
      setPhoneNumber("");
      setAmount("");
      setOperator("");
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-primary">Quick Recharge</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              maxLength={10}
              className="mt-1"
            />
          </div>
          
          {phoneNumber.length === 10 && operator && operator !== "Unknown" && (
            <div className="p-3 bg-green-light rounded-lg flex items-center space-x-3">
              <img 
                src={operators[operator].logo} 
                alt={operator}
                className="w-8 h-8 rounded"
              />
              <div className="flex items-center space-x-2">
                <Check size={16} className="text-green-primary" />
                <p className="text-sm text-green-primary font-medium">
                  Detected Operator: {operator}
                </p>
              </div>
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
              className="mt-1"
            />
          </div>

          {amount && (
            <div className="p-3 bg-gray-50 rounded-lg space-y-1">
              <div className="flex justify-between text-sm font-medium">
                <span>Recharge Amount:</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-blue-600">
                <span>Wallet Balance:</span>
                <span>₹{currentBalance.toFixed(2)}</span>
              </div>
              {willUseUPI && (
                <div className="flex justify-between text-sm font-medium text-orange-600">
                  <span>Payment Method:</span>
                  <div className="flex items-center space-x-1">
                    <CreditCard size={14} />
                    <span>UPI Payment</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={handleRecharge}
              className="flex-1 green-gradient text-white"
              disabled={!phoneNumber || phoneNumber.length !== 10 || !amount || operator === "Unknown" || !operator || isProcessing}
            >
              {isProcessing ? "Processing..." : willUseUPI ? "Pay via UPI" : "Recharge Now"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickRechargeDialog;
