
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface BillPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (billData: any) => void;
  billType: string;
}

const BillPaymentDialog = ({ isOpen, onClose, onSuccess, billType }: BillPaymentDialogProps) => {
  const [billNumber, setBillNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("");
  const { toast } = useToast();

  const getProviders = () => {
    switch (billType) {
      case "DTH":
        return ["Tata Sky", "Dish TV", "Airtel Digital TV", "Sun Direct", "D2H"];
      case "Electricity":
        return ["MSEB", "BESCOM", "TNEB", "PSEB", "UPPCL"];
      case "Gas":
        return ["Indane", "Bharat Gas", "HP Gas", "Others"];
      case "Water":
        return ["Municipal Corporation", "Water Board", "Others"];
      case "Broadband":
        return ["Airtel", "Jio Fiber", "ACT", "BSNL", "Others"];
      default:
        return [];
    }
  };

  const handlePayment = () => {
    if (!billNumber || !amount || !provider) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = parseFloat(amount);
    const commission = totalAmount * 0.015; // 1.5% commission deducted
    const billAmount = totalAmount - commission; // Amount after commission deduction

    const billData = {
      id: `TXN${Date.now()}`,
      type: `${billType} Bill`,
      operator: provider,
      number: `****${billNumber.slice(-4)}`,
      amount: billAmount,
      commission,
      totalAmount,
      status: "Success",
      date: new Date().toISOString().split('T')[0],
      fullNumber: billNumber
    };

    toast({
      title: "Payment Initiated",
      description: `Processing ₹${billAmount.toFixed(2)} payment for ${billType}...`,
    });

    setTimeout(() => {
      onSuccess(billData);
      onClose();
      setBillNumber("");
      setAmount("");
      setProvider("");
      toast({
        title: "Payment Successful",
        description: `₹${billAmount.toFixed(2)} paid successfully!`,
      });
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-primary">{billType} Bill Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="provider">Service Provider</Label>
            <Select onValueChange={setProvider}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {getProviders().map((providerOption) => (
                  <SelectItem key={providerOption} value={providerOption}>
                    {providerOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bill-number">Bill/Account Number</Label>
            <Input
              id="bill-number"
              placeholder="Enter bill number"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bill-amount">Amount</Label>
            <Input
              id="bill-amount"
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
                <span>Total Amount:</span>
                <span>₹{amount}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>Commission (1.5%):</span>
                <span>-₹{(parseFloat(amount || "0") * 0.015).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Bill Amount:</span>
                <span>₹{(parseFloat(amount || "0") * 0.985).toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={handlePayment}
              className="flex-1 green-gradient text-white"
              disabled={!billNumber || !amount || !provider}
            >
              Pay Now
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

export default BillPaymentDialog;
