import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface ElectricityBillDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (billData: any) => void;
}

const ElectricityBillDialog = ({ isOpen, onClose, onSuccess }: ElectricityBillDialogProps) => {
  const [board, setBoard] = useState("");
  const [consumerId, setConsumerId] = useState("");
  const [step, setStep] = useState(1);
  const [billInfo, setBillInfo] = useState<any>(null);
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

    // Simulate bill fetch
    toast({
      title: "Fetching Bill",
      description: "Please wait while we fetch your bill details...",
    });

    setTimeout(() => {
      const mockBillData = {
        consumerName: "John Doe",
        consumerId: consumerId,
        board: board.split(" - ")[0],
        billAmount: Math.floor(Math.random() * 2000) + 500, // Random amount between 500-2500
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        billNumber: `EB${Date.now()}`,
        units: Math.floor(Math.random() * 300) + 100
      };
      setBillInfo(mockBillData);
      setStep(2);
      toast({
        title: "Bill Fetched",
        description: "Bill details loaded successfully!",
      });
    }, 2000);
  };

  const handlePayment = () => {
    const totalAmount = billInfo.billAmount;
    const commission = totalAmount * 0.015; // 1.5% commission deducted
    const billAmount = totalAmount - commission; // Amount after commission deduction

    const billData = {
      id: `TXN${Date.now()}`,
      type: "Electricity Bill",
      operator: billInfo.board,
      number: `****${consumerId.slice(-4)}`,
      amount: billAmount,
      commission,
      totalAmount,
      status: "Success",
      date: new Date().toISOString().split('T')[0],
      fullNumber: consumerId,
      canComplain: true,
      canRepeat: true,
      consumerName: billInfo.consumerName,
      billNumber: billInfo.billNumber
    };

    toast({
      title: "Payment Initiated",
      description: `Processing ₹${billAmount.toFixed(2)} payment...`,
    });

    setTimeout(() => {
      onSuccess(billData);
      onClose();
      setBoard("");
      setConsumerId("");
      setStep(1);
      setBillInfo(null);
      toast({
        title: "Payment Successful",
        description: `₹${billAmount.toFixed(2)} paid successfully!`,
      });
    }, 2000);
  };

  const goBack = () => {
    setStep(1);
    setBillInfo(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-green-primary">
            Electricity Bill Payment - Step {step} of 2
          </DialogTitle>
        </DialogHeader>
        
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="board">Electricity Board</Label>
              <Select onValueChange={setBoard}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your electricity board" />
                </SelectTrigger>
                <SelectContent>
                  {electricityBoards.map((boardOption) => (
                    <SelectItem key={boardOption} value={boardOption}>
                      {boardOption}
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
                className="mt-1"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={fetchBillInfo}
                className="flex-1 green-gradient text-white"
                disabled={!board || !consumerId}
              >
                Fetch Bill
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
        )}

        {step === 2 && billInfo && (
          <div className="space-y-4">
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

            <div className="p-3 bg-gray-50 rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span>Total Amount:</span>
                <span>₹{billInfo.billAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>Commission (1.5%):</span>
                <span>-₹{(billInfo.billAmount * 0.015).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Bill Amount:</span>
                <span>₹{(billInfo.billAmount * 0.985).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handlePayment}
                className="flex-1 green-gradient text-white"
              >
                Pay Now
              </Button>
              <Button
                variant="outline"
                onClick={goBack}
                className="flex-1"
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ElectricityBillDialog;
