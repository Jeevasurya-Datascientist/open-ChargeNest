
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Smartphone, Building } from "lucide-react";

interface TransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransferDialog = ({ isOpen, onClose }: TransferDialogProps) => {
  const [transferType, setTransferType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [upiId, setUpiId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const handleNext = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    let paymentUrl = "";
    
    if (transferType === "upi" && upiId) {
      paymentUrl = `upi://pay?pa=${upiId}&am=${amount}&cu=INR`;
    } else if (transferType === "phone" && phoneNumber) {
      paymentUrl = `upi://pay?pa=${phoneNumber}@paytm&am=${amount}&cu=INR`;
    } else if (transferType === "bank" && accountNumber && ifscCode) {
      // For bank transfer, we'll use a generic UPI app link
      paymentUrl = `upi://pay?mode=02&am=${amount}&cu=INR`;
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Try to open UPI app
    if (paymentUrl) {
      window.location.href = paymentUrl;
      
      toast({
        title: "Redirecting to UPI App",
        description: "Opening your preferred UPI app...",
      });
      
      onClose();
    }
  };

  const resetForm = () => {
    setTransferType("");
    setPhoneNumber("");
    setUpiId("");
    setAccountNumber("");
    setIfscCode("");
    setAmount("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-primary">Transfer Money</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Transfer Method</Label>
            <Select value={transferType} onValueChange={setTransferType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select transfer method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Phone Number</span>
                  </div>
                </SelectItem>
                <SelectItem value="upi">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>UPI ID</span>
                  </div>
                </SelectItem>
                <SelectItem value="bank">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>Bank Account</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {transferType === "phone" && (
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="mt-1"
              />
            </div>
          )}

          {transferType === "upi" && (
            <div>
              <Label htmlFor="upi">UPI ID</Label>
              <Input
                id="upi"
                placeholder="example@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          {transferType === "bank" && (
            <>
              <div>
                <Label htmlFor="account">Account Number</Label>
                <Input
                  id="account"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ifsc">IFSC Code</Label>
                <Input
                  id="ifsc"
                  placeholder="Enter IFSC code"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  className="mt-1"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleNext}
              className="flex-1 green-gradient text-white"
              disabled={!transferType || !amount}
            >
              Next
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
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

export default TransferDialog;
