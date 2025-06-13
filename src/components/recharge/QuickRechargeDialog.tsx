
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface QuickRechargeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (rechargeData: any) => void;
}

const QuickRechargeDialog = ({ isOpen, onClose, onSuccess }: QuickRechargeDialogProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [operator, setOperator] = useState("");
  const { toast } = useToast();

  const detectOperator = (number: string) => {
    const firstFour = number.substring(0, 4);
    
    // Jio prefixes
    if (['8907', '8908', '8909', '8910', '7023', '7024', '7025'].some(prefix => firstFour.startsWith(prefix))) {
      return "Jio";
    }
    // Airtel prefixes
    if (['9910', '9911', '9912', '7800', '7801', '7802'].some(prefix => firstFour.startsWith(prefix))) {
      return "Airtel";
    }
    // Vi (Vodafone Idea) prefixes
    if (['9826', '9827', '9828', '7000', '7001', '7002'].some(prefix => firstFour.startsWith(prefix))) {
      return "Vi";
    }
    // BSNL prefixes
    if (['9400', '9401', '9402', '6000', '6001', '6002'].some(prefix => firstFour.startsWith(prefix))) {
      return "BSNL";
    }
    
    return "Unknown";
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    if (value.length >= 4) {
      const detectedOperator = detectOperator(value);
      setOperator(detectedOperator);
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

    if (operator === "Unknown") {
      toast({
        title: "Operator Not Detected",
        description: "Could not detect operator for this number",
        variant: "destructive"
      });
      return;
    }

    const rechargeAmount = parseFloat(amount);
    const commission = rechargeAmount * 0.02; // 2% commission
    const finalAmount = rechargeAmount + commission;

    const rechargeData = {
      id: `TXN${Date.now()}`,
      type: "Mobile Recharge",
      operator,
      number: `****${phoneNumber.slice(-4)}`,
      amount: rechargeAmount,
      commission,
      totalAmount: finalAmount,
      status: "Success",
      date: new Date().toISOString().split('T')[0],
      fullNumber: phoneNumber
    };

    toast({
      title: "Recharge Initiated",
      description: `Processing ₹${rechargeAmount} recharge for ${operator}...`,
    });

    // Simulate recharge process
    setTimeout(() => {
      onSuccess(rechargeData);
      onClose();
      setPhoneNumber("");
      setAmount("");
      setOperator("");
      toast({
        title: "Recharge Successful",
        description: `₹${rechargeAmount} recharged successfully!`,
      });
    }, 2000);
  };

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
          
          {operator && operator !== "Unknown" && (
            <div className="p-3 bg-green-light rounded-lg">
              <p className="text-sm text-green-primary font-medium">
                Detected Operator: {operator}
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
              className="mt-1"
            />
          </div>

          {amount && (
            <div className="p-3 bg-gray-50 rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span>Recharge Amount:</span>
                <span>₹{amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Commission (2%):</span>
                <span>₹{(parseFloat(amount || "0") * 0.02).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Total Amount:</span>
                <span>₹{(parseFloat(amount || "0") * 1.02).toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={handleRecharge}
              className="flex-1 green-gradient text-white"
              disabled={!phoneNumber || !amount || operator === "Unknown"}
            >
              Recharge Now
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
