
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard } from "lucide-react";
import { WalletManager } from "@/utils/walletManager";
import { billerLogos } from "@/utils/operatorDetection";

interface BillPaymentPageProps {
  onBack: () => void;
  onSuccess: (billData: any) => void;
  billType: string;
}

const BillPaymentPage = ({ onBack, onSuccess, billType }: BillPaymentPageProps) => {
  const [billNumber, setBillNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const getProviders = () => {
    switch (billType) {
      case "DTH":
        return ["Tata Sky", "Dish TV", "Airtel Digital TV", "Sun Direct", "D2H"];
      case "Electricity":
        return ["MSEB", "BESCOM", "TNEB", "PSEB", "UPPCL"];
      case "Gas":
        return ["Indane", "Bharat Gas", "HP Gas"];
      case "Water":
        return ["Municipal Corporation", "Water Board"];
      case "Broadband":
        return ["Airtel", "Jio Fiber", "ACT", "BSNL"];
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
    const commission = totalAmount * 0.02;
    const currentBalance = WalletManager.getBalance();

    setIsProcessing(true);

    if (currentBalance >= totalAmount) {
      // Deduct from wallet
      const walletResult = WalletManager.deductMoney(totalAmount, `${billType} Bill - ${provider}`);
      
      if (walletResult.success) {
        processBillPayment(totalAmount, commission, "Wallet");
      }
    } else {
      // Initiate UPI transaction for the exact bill amount
      toast({
        title: "Insufficient Wallet Balance",
        description: `Redirecting to UPI for ₹${totalAmount} payment...`,
      });

      setTimeout(() => {
        processBillPayment(totalAmount, commission, "UPI");
      }, 3000);
    }
  };

  const processBillPayment = (totalAmount: number, commission: number, paymentMethod: string) => {
    const billData = {
      id: `TXN${Date.now()}`,
      type: `${billType} Bill`,
      operator: provider,
      number: `****${billNumber.slice(-4)}`,
      amount: totalAmount,
      commission,
      status: "Success",
      date: new Date().toISOString().split('T')[0],
      fullNumber: billNumber,
      paymentMethod,
      canComplain: true,
      canRepeat: true
    };

    setTimeout(() => {
      onSuccess(billData);
      setIsProcessing(false);
      toast({
        title: "Payment Successful",
        description: `₹${totalAmount} paid successfully via ${paymentMethod}!`,
      });
    }, 2000);
  };

  const currentBalance = WalletManager.getBalance();
  const totalAmount = parseFloat(amount || "0");
  const commission = totalAmount * 0.02;
  const willUseUPI = currentBalance < totalAmount && totalAmount > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-white border-b z-50">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-3">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold text-green-primary">{billType} Bill Payment</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <Label htmlFor="provider">Service Provider</Label>
          <Select onValueChange={setProvider}>
            <SelectTrigger className="mt-2 h-12">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {getProviders().map((providerOption) => (
                <SelectItem key={providerOption} value={providerOption}>
                  <div className="flex items-center space-x-2">
                    <img 
                      src={billerLogos[providerOption] || "/logos/default.png"} 
                      alt={providerOption}
                      className="w-6 h-6 rounded"
                      onError={(e) => {
                        e.currentTarget.src = "/logos/default.png";
                      }}
                    />
                    <span>{providerOption}</span>
                  </div>
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
            className="mt-2 h-12 text-lg"
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
            className="mt-2 h-12 text-lg"
          />
        </div>

        {amount && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="flex justify-between font-medium">
              <span>Bill Amount:</span>
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
          onClick={handlePayment}
          className="w-full green-gradient text-white h-12 text-lg"
          disabled={!billNumber || !amount || !provider || isProcessing}
        >
          {isProcessing ? "Processing..." : willUseUPI ? "Pay via UPI" : "Pay Bill"}
        </Button>
      </div>
    </div>
  );
};

export default BillPaymentPage;
