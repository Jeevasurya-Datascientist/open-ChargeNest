
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Smartphone, Building, ArrowLeft } from "lucide-react";

interface TransferPageProps {
  onBack: () => void;
}

const TransferPage = ({ onBack }: TransferPageProps) => {
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
      paymentUrl = `upi://pay?mode=02&am=${amount}&cu=INR`;
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    if (paymentUrl) {
      window.location.href = paymentUrl;
      
      toast({
        title: "Redirecting to UPI App",
        description: "Opening your preferred UPI app...",
      });
      
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b z-50">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold text-green-primary">Transfer Money</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        <div>
          <Label>Transfer Method</Label>
          <Select value={transferType} onValueChange={setTransferType}>
            <SelectTrigger className="mt-2 h-12">
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
              className="mt-2 h-12"
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
              className="mt-2 h-12"
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
                className="mt-2 h-12"
              />
            </div>
            <div>
              <Label htmlFor="ifsc">IFSC Code</Label>
              <Input
                id="ifsc"
                placeholder="Enter IFSC code"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                className="mt-2 h-12"
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
            className="mt-2 h-12 text-lg"
          />
        </div>

        <Button
          onClick={handleNext}
          className="w-full green-gradient text-white h-12 text-lg"
          disabled={!transferType || !amount}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default TransferPage;
