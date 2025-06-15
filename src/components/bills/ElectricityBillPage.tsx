
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { generateConsumerName, generateBillNumber } from "@/utils/nameGenerator";
import { ArrowLeft, CreditCard } from "lucide-react";
import { WalletManager } from "@/utils/walletManager";
import { billerLogos } from "@/utils/operatorDetection";

interface ElectricityBillPageProps {
  onBack: () => void;
  onSuccess: (billData: any) => void;
}

const ElectricityBillPage = ({ onBack, onSuccess }: ElectricityBillPageProps) => {
  const [board, setBoard] = useState("");
  const [consumerId, setConsumerId] = useState("");
  const [step, setStep] = useState(1);
  const [billInfo, setBillInfo] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const electricityBoards = [
    "MSEB - Maharashtra State Electricity Board",
    "BESCOM - Bangalore Electricity Supply Company",
    "TNEB - Tamil Nadu Electricity Board", 
    "PSEB - Punjab State Electricity Board",
    "UPPCL - Uttar Pradesh Power Corporation",
    "KESC - Karachi Electric Supply Company",
    "WBSEDCL - West Bengal State Electricity Distribution",
    "KSEB - Kerala State Electricity Board",
    "GSECL - Gujarat State Electricity Corporation",
    "RSEB - Rajasthan State Electricity Board"
  ];

  const fetchBillInfo = () => {
    if (!board || !consumerId) {
      toast({
        title: "Missing Information",
        description: "Please select board and enter consumer ID",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Fetching Bill",
      description: "Please wait while we fetch your bill details...",
    });

    setTimeout(() => {
      const consumerName = generateConsumerName(consumerId);
      const boardCode = board.split(" - ")[0];
      const billNumber = generateBillNumber(consumerId, boardCode);
      
      const mockBillData = {
        consumerName,
        consumerId: consumerId,
        board: boardCode,
        billAmount: Math.floor(Math.random() * 2000) + 500,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        billNumber,
        units: Math.floor(Math.random() * 300) + 100
      };
      setBillInfo(mockBillData);
      setStep(2);
      toast({
        title: "Bill Fetched",
        description: `Bill for ${consumerName} loaded successfully!`,
      });
    }, 2000);
  };

  const handlePayment = () => {
    const totalAmount = billInfo.billAmount;
    const commission = totalAmount * 0.02;
    const currentBalance = WalletManager.getBalance();

    setIsProcessing(true);

    if (currentBalance >= totalAmount) {
      const walletResult = WalletManager.deductMoney(totalAmount, `Electricity Bill - ${billInfo.board}`);
      
      if (walletResult.success) {
        processPayment(totalAmount, commission, "Wallet");
      }
    } else {
      toast({
        title: "Insufficient Wallet Balance",
        description: `Redirecting to UPI for ₹${totalAmount} payment...`,
      });

      setTimeout(() => {
        processPayment(totalAmount, commission, "UPI");
      }, 3000);
    }
  };

  const processPayment = (totalAmount: number, commission: number, paymentMethod: string) => {
    const billData = {
      id: `TXN${Date.now()}`,
      type: "Electricity Bill",
      operator: billInfo.board,
      number: `****${consumerId.slice(-4)}`,
      amount: totalAmount,
      commission,
      status: "Success",
      date: new Date().toISOString().split('T')[0],
      fullNumber: consumerId,
      canComplain: true,
      canRepeat: true,
      consumerName: billInfo.consumerName,
      billNumber: billInfo.billNumber,
      paymentMethod
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
  const willUseUPI = billInfo && currentBalance < billInfo.billAmount;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 bg-white border-b z-50">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="sm" onClick={step === 1 ? onBack : () => setStep(1)} className="mr-3">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold text-green-primary">
            Electricity Bill Payment - Step {step} of 2
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {step === 1 && (
          <>
            <div>
              <Label htmlFor="board">Electricity Board</Label>
              <Select onValueChange={setBoard}>
                <SelectTrigger className="mt-2 h-12">
                  <SelectValue placeholder="Select your electricity board" />
                </SelectTrigger>
                <SelectContent>
                  {electricityBoards.map((boardOption) => (
                    <SelectItem key={boardOption} value={boardOption}>
                      <div className="flex items-center space-x-2">
                        <img 
                          src={billerLogos[boardOption.split(" - ")[0]] || "/logos/default.png"} 
                          alt={boardOption.split(" - ")[0]}
                          className="w-6 h-6 rounded"
                          onError={(e) => {
                            e.currentTarget.src = "/logos/default.png";
                          }}
                        />
                        <span>{boardOption}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="consumer-id">Consumer ID</Label>
              <Input
                id="consumer-id"
                placeholder="Enter your consumer ID"
                value={consumerId}
                onChange={(e) => setConsumerId(e.target.value)}
                className="mt-2 h-12 text-lg"
              />
            </div>

            <Button
              onClick={fetchBillInfo}
              className="w-full green-gradient text-white h-12 text-lg"
              disabled={!board || !consumerId}
            >
              Fetch Bill
            </Button>
          </>
        )}

        {step === 2 && billInfo && (
          <>
            <Card className="p-4 bg-green-light">
              <h3 className="font-semibold text-green-primary mb-3">Bill Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Consumer Name:</span>
                  <span className="font-medium">{billInfo.consumerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Consumer ID:</span>
                  <span className="font-medium">{billInfo.consumerId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Board:</span>
                  <span className="font-medium">{billInfo.board}</span>
                </div>
                <div className="flex justify-between">
                  <span>Units Consumed:</span>
                  <span className="font-medium">{billInfo.units} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span>Due Date:</span>
                  <span className="font-medium">{billInfo.dueDate}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-green-primary">
                  <span>Bill Amount:</span>
                  <span>₹{billInfo.billAmount}</span>
                </div>
              </div>
            </Card>

            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between font-medium">
                <span>Bill Amount:</span>
                <span>₹{billInfo.billAmount}</span>
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

            <Button
              onClick={handlePayment}
              className="w-full green-gradient text-white h-12 text-lg"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : willUseUPI ? "Pay via UPI" : "Pay Now"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ElectricityBillPage;
