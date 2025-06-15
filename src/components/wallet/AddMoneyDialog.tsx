
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { WalletManager } from "@/utils/walletManager";

interface AddMoneyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const AddMoneyDialog = ({ isOpen, onClose, onSuccess }: AddMoneyDialogProps) => {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleAddMoney = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || numAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (numAmount > 50000) {
      toast({
        title: "Amount Limit Exceeded",
        description: "Maximum amount allowed is ₹50,000 per transaction",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate UPI app redirect
    toast({
      title: "Redirecting to UPI",
      description: "Opening your UPI app to complete payment...",
    });

    // Simulate UPI payment process
    setTimeout(() => {
      try {
        // Add money to wallet using WalletManager
        const transaction = WalletManager.addMoney(numAmount, `UPI Payment - ₹${numAmount}`);
        
        onSuccess(numAmount);
        onClose();
        setAmount("");
        setIsProcessing(false);
        
        toast({
          title: "Payment Successful",
          description: `₹${numAmount} added to your wallet successfully!`,
        });
      } catch (error) {
        setIsProcessing(false);
        toast({
          title: "Payment Failed",
          description: "Failed to add money to wallet. Please try again.",
          variant: "destructive"
        });
      }
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-primary">Add Money to Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (Min: ₹1, Max: ₹50,000)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max="50000"
              step="1"
              className="mt-1"
              disabled={isProcessing}
            />
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-600">
              💡 <strong>Secure Payment:</strong> Your payment is processed through encrypted UPI gateway. 
              Money will be instantly credited to your wallet after successful payment.
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleAddMoney}
              className="flex-1 green-gradient text-white"
              disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay with UPI"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMoneyDialog;
