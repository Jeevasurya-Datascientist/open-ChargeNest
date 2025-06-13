
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AddMoneyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

const AddMoneyDialog = ({ isOpen, onClose, onSuccess }: AddMoneyDialogProps) => {
  const [amount, setAmount] = useState("");
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

    if (numAmount > 1) {
      toast({
        title: "Amount Limit Exceeded",
        description: "Maximum amount allowed is ₹1",
        variant: "destructive"
      });
      return;
    }

    // Simulate UPI app redirect
    toast({
      title: "Redirecting to UPI",
      description: "Opening your UPI app to complete payment...",
    });

    // Simulate UPI payment process
    setTimeout(() => {
      onSuccess(numAmount);
      onClose();
      setAmount("");
      toast({
        title: "Money Added Successfully",
        description: `₹${numAmount} added to your wallet`,
      });
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-primary">Add Money to Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (Max: ₹1)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max="1"
              step="0.01"
              className="mt-1"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleAddMoney}
              className="flex-1 green-gradient text-white"
            >
              Pay with UPI
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

export default AddMoneyDialog;
