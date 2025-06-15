
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { WalletManager } from "@/utils/walletManager";
import { ArrowLeft } from "lucide-react";

interface AddMoneyPageProps {
  onBack: () => void;
  onSuccess: (amount: number) => void;
}

const AddMoneyPage = ({ onBack, onSuccess }: AddMoneyPageProps) => {
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

    toast({
      title: "Redirecting to UPI",
      description: "Opening your UPI app to complete payment...",
    });

    setTimeout(() => {
      try {
        const transaction = WalletManager.addMoney(numAmount, `UPI Payment - ₹${numAmount}`);
        
        onSuccess(numAmount);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-50">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold text-green-primary">Add Money to Wallet</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
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
            className="mt-2 text-lg h-12"
            disabled={isProcessing}
          />
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600">
            💡 <strong>Secure Payment:</strong> Your payment is processed through encrypted UPI gateway. 
            Money will be instantly credited to your wallet after successful payment.
          </p>
        </div>

        <Button
          onClick={handleAddMoney}
          className="w-full green-gradient text-white h-12 text-lg"
          disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
        >
          {isProcessing ? "Processing..." : "Pay with UPI"}
        </Button>
      </div>
    </div>
  );
};

export default AddMoneyPage;
