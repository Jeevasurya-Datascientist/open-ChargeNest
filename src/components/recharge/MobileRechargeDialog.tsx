import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Check, Star } from "lucide-react";
import { detectOperator, operators } from "@/utils/operatorDetection";
import { getPlansForOperator, RechargePlan } from "@/utils/rechargeData";

interface MobileRechargeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (rechargeData: any) => void;
}

const MobileRechargeDialog = ({ isOpen, onClose, onSuccess }: MobileRechargeDialogProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [operator, setOperator] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<RechargePlan | null>(null);
  const [plans, setPlans] = useState<RechargePlan[]>([]);
  const [showPlans, setShowPlans] = useState(false);
  const { toast } = useToast();

  const handlePhoneChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(numericValue);
    
    if (numericValue.length === 10) {
      const detectedOperator = detectOperator(numericValue);
      setOperator(detectedOperator);
      
      if (detectedOperator && detectedOperator !== "Unknown") {
        const operatorPlans = getPlansForOperator(detectedOperator);
        setPlans(operatorPlans);
        setShowPlans(true);
        setSelectedPlan(null);
      } else {
        setShowPlans(false);
        setPlans([]);
      }
    } else {
      setOperator("");
      setShowPlans(false);
      setPlans([]);
      setSelectedPlan(null);
    }
  };

  const handlePlanSelect = (plan: RechargePlan) => {
    setSelectedPlan(plan);
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

    if (operator === "Unknown" || !operator) {
      toast({
        title: "Operator Not Detected",
        description: "Could not detect operator for this number",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPlan) {
      toast({
        title: "Select Plan",
        description: "Please select a recharge plan",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = selectedPlan.amount;
    const commission = totalAmount * 0.02; // 2% commission deducted
    const rechargeAmount = totalAmount - commission; // Amount after commission deduction

    const rechargeData = {
      id: `TXN${Date.now()}`,
      type: "Mobile Recharge",
      operator,
      number: `****${phoneNumber.slice(-4)}`,
      amount: rechargeAmount,
      commission,
      totalAmount,
      status: "Success",
      date: new Date().toISOString().split('T')[0],
      fullNumber: phoneNumber,
      planDetails: selectedPlan,
      canComplain: true,
      canRepeat: true
    };

    toast({
      title: "Recharge Initiated",
      description: `Processing ₹${rechargeAmount.toFixed(2)} recharge for ${operator}...`,
    });

    setTimeout(() => {
      onSuccess(rechargeData);
      onClose();
      setPhoneNumber("");
      setOperator("");
      setSelectedPlan(null);
      setShowPlans(false);
      setPlans([]);
      toast({
        title: "Recharge Successful",
        description: `₹${rechargeAmount.toFixed(2)} recharged successfully!`,
      });
    }, 2000);
  };

  const filteredPlans = (type: string) => {
    return plans.filter(plan => plan.type === type);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-green-primary">Mobile Recharge</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">Mobile Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={phoneNumber}
              onChange={(e) => handlePhoneChange(e.target.value)}
              maxLength={10}
              className="mt-1"
            />
          </div>
          
          {phoneNumber.length === 10 && operator && operator !== "Unknown" && (
            <div className="p-3 bg-green-light rounded-lg flex items-center space-x-3">
              <img 
                src={operators[operator].logo} 
                alt={operator}
                className="w-8 h-8 rounded"
              />
              <div className="flex items-center space-x-2">
                <Check size={16} className="text-green-primary" />
                <p className="text-sm text-green-primary font-medium">
                  Detected Operator: {operator}
                </p>
              </div>
            </div>
          )}

          {phoneNumber.length === 10 && operator === "Unknown" && (
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600 font-medium">
                Operator not detected for this number
              </p>
            </div>
          )}

          {showPlans && plans.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-green-primary">Select Recharge Plan</h3>
              
              <Tabs defaultValue="fulltt" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="fulltt">Full Talktime</TabsTrigger>
                  <TabsTrigger value="data">Data</TabsTrigger>
                  <TabsTrigger value="topup">Top Up</TabsTrigger>
                  <TabsTrigger value="roaming">Roaming</TabsTrigger>
                </TabsList>
                
                <TabsContent value="fulltt" className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredPlans('fulltt').map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedPlan?.id === plan.id 
                          ? 'border-green-primary bg-green-light' 
                          : 'border-gray-200 hover:border-green-primary'
                      }`}
                      onClick={() => handlePlanSelect(plan)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">₹{plan.amount}</h4>
                            {plan.popular && (
                              <Badge className="bg-orange-500 text-white">
                                <Star size={12} className="mr-1" />
                                Popular
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{plan.description}</p>
                          <p className="text-xs text-gray-500">Validity: {plan.validity}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {plan.benefits.map((benefit, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {selectedPlan?.id === plan.id && (
                          <Check size={20} className="text-green-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="data" className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredPlans('data').map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedPlan?.id === plan.id 
                          ? 'border-green-primary bg-green-light' 
                          : 'border-gray-200 hover:border-green-primary'
                      }`}
                      onClick={() => handlePlanSelect(plan)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">₹{plan.amount}</h4>
                          <p className="text-sm text-gray-600">{plan.description}</p>
                          <p className="text-xs text-gray-500">Validity: {plan.validity}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {plan.benefits.map((benefit, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {selectedPlan?.id === plan.id && (
                          <Check size={20} className="text-green-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="topup" className="space-y-2 max-h-60 overflow-y-auto">
                  {filteredPlans('topup').map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedPlan?.id === plan.id 
                          ? 'border-green-primary bg-green-light' 
                          : 'border-gray-200 hover:border-green-primary'
                      }`}
                      onClick={() => handlePlanSelect(plan)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">₹{plan.amount}</h4>
                          <p className="text-sm text-gray-600">{plan.description}</p>
                          <p className="text-xs text-gray-500">Validity: {plan.validity}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {plan.benefits.map((benefit, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {selectedPlan?.id === plan.id && (
                          <Check size={20} className="text-green-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="roaming" className="space-y-2 max-h-60 overflow-y-auto">
                  <div className="text-center text-gray-500 py-8">
                    <p>No roaming plans available</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {selectedPlan && (
            <div className="p-3 bg-gray-50 rounded-lg space-y-1">
              <div className="flex justify-between text-sm">
                <span>Plan Amount:</span>
                <span>₹{selectedPlan.amount}</span>
              </div>
              <div className="flex justify-between text-sm text-red-600">
                <span>Commission (2%):</span>
                <span>-₹{(selectedPlan.amount * 0.02).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Recharge Amount:</span>
                <span>₹{(selectedPlan.amount * 0.98).toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={handleRecharge}
              className="flex-1 green-gradient text-white"
              disabled={!phoneNumber || phoneNumber.length !== 10 || !selectedPlan || operator === "Unknown" || !operator}
            >
              Proceed to Pay
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

export default MobileRechargeDialog;
