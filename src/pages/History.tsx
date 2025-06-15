
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, Clock, Phone, Search, Filter, MoreVertical, MessageSquare, Repeat, Share, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RechargeManager } from "@/utils/rechargeManager";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showCommissionFor, setShowCommissionFor] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    setTransactions(savedHistory);
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.operator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status?.toLowerCase() === statusFilter;
    const matchesType = typeFilter === "all" || transaction.type?.toLowerCase().includes(typeFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleComplaint = (transaction: any) => {
    const complaintText = `Transaction Issue Report:
Transaction ID: ${transaction.id}
Operator: ${transaction.operator}
Phone Number: ${transaction.fullNumber || transaction.number}
Amount: ₹${transaction.amount}
Date: ${transaction.date}
Status: ${transaction.status}

Issue: Please help resolve this transaction issue.`;

    const whatsappUrl = `https://wa.me/919789456787?text=${encodeURIComponent(complaintText)}`;
    window.open(whatsappUrl, '_blank');

    toast({
      title: "Complaint Initiated",
      description: "Opening WhatsApp to connect with admin support",
    });
  };

  const handleRepeat = (transaction: any) => {
    if (!RechargeManager.canRepeatRecharge(transaction.fullNumber)) {
      const timeRemaining = RechargeManager.getTimeUntilNextRecharge(transaction.fullNumber);
      const timeLeft = Math.ceil(timeRemaining / 1000 / 60);
      toast({
        title: "Recharge Limit",
        description: `Please wait ${timeLeft} minute(s) before recharging this number again`,
        variant: "destructive"
      });
      return;
    }

    // Navigate to recharge page with prefilled data
    const rechargeData = {
      fullNumber: transaction.fullNumber,
      amount: transaction.amount,
      operator: transaction.operator
    };
    
    // Store data temporarily and navigate
    sessionStorage.setItem('repeatRechargeData', JSON.stringify(rechargeData));
    window.location.href = '/?repeat=true';
  };

  const generatePDFReceipt = (transaction: any) => {
    const receiptContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                        GREENCHARGE RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Transaction Details:
──────────────────────────────────────────────────────────────

Transaction ID: ${transaction.id}
Date & Time: ${transaction.date}
Transaction Type: ${transaction.type}

Service Details:
──────────────────────────────────────────────────────────────
Operator: ${transaction.operator}
Mobile Number: ${transaction.fullNumber || transaction.number}
Amount: ₹${transaction.amount}
Status: ${transaction.status}
Payment Method: ${transaction.paymentMethod || 'Wallet'}

Customer Information:
──────────────────────────────────────────────────────────────
Service provided by GreenCharge Hub
All transactions are secured and encrypted

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for using GreenCharge!
For support: contact@greencharge.com
Support WhatsApp: +91 9789456787

Terms and conditions apply.
Visit www.greencharge.com for more details.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `GreenCharge_Receipt_${transaction.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Receipt Downloaded",
      description: "Receipt has been saved to your downloads",
    });
  };

  const handleShare = (transaction: any) => {
    const receiptText = `
GreenCharge Receipt
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Transaction ID: ${transaction.id}
Type: ${transaction.type}
Operator: ${transaction.operator}
Number: ${transaction.fullNumber || transaction.number}
Amount: ₹${transaction.amount}
Status: ${transaction.status}
Date: ${transaction.date}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Thank you for using GreenCharge!
    `;
    
    if (navigator.share) {
      navigator.share({
        title: 'Transaction Receipt',
        text: receiptText,
      });
    } else {
      generatePDFReceipt(transaction);
    }
  };

  const toggleCommissionView = (transactionId: string) => {
    setShowCommissionFor(showCommissionFor === transactionId ? null : transactionId);
  };

  // Check if transaction is a mobile recharge (can be repeated)
  const isMobileRecharge = (transaction: any) => {
    return transaction.type?.toLowerCase().includes('recharge') || 
           transaction.type?.toLowerCase().includes('mobile');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Transaction History" />
      
      <div className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="recharge">Recharge</SelectItem>
                <SelectItem value="bill">Bill Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTransactions.map((transaction, index) => (
            <Card 
              key={transaction.id}
              className="p-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-light rounded-lg">
                  <Phone size={20} className="text-green-primary" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm text-green-primary">
                      {transaction.type}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-foreground">
                        ₹{transaction.amount}
                      </span>
                      {transaction.commission && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => toggleCommissionView(transaction.id)}
                        >
                          {showCommissionFor === transaction.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleComplaint(transaction)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Raise Complaint
                          </DropdownMenuItem>
                          {isMobileRecharge(transaction) && (
                            <DropdownMenuItem onClick={() => handleRepeat(transaction)}>
                              <Repeat className="mr-2 h-4 w-4" />
                              Repeat Recharge
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleShare(transaction)}>
                            <Share className="mr-2 h-4 w-4" />
                            Share Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {transaction.operator} • {transaction.fullNumber || transaction.number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date} • {transaction.id}
                      </p>
                      {showCommissionFor === transaction.id && transaction.commission && (
                        <p className="text-xs text-red-600 mt-1">
                          Commission: ₹{transaction.commission.toFixed(2)} (2%)
                        </p>
                      )}
                    </div>
                    
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                      transaction.status === "Success" 
                        ? "bg-green-light text-green-primary" 
                        : transaction.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {transaction.status === "Success" ? (
                        <Check size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      <span>{transaction.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default History;
