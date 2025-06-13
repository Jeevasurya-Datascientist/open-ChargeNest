
import { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check, Clock, Phone, Settings, Search, Filter, MoreVertical, MessageSquare, Repeat, Share } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
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
  const [showComplaintDialog, setShowComplaintDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [complaintMessage, setComplaintMessage] = useState("");
  const { toast } = useToast();

  const transactions = [
    {
      id: "TXN001",
      type: "Mobile Recharge",
      operator: "Jio",
      number: "****1234",
      amount: 199,
      status: "Success",
      date: "2024-01-10",
      icon: Phone,
      canComplain: true,
      canRepeat: true
    },
    {
      id: "TXN002", 
      type: "Electricity Bill",
      operator: "MSEB",
      number: "****5678",
      amount: 850,
      status: "Success",
      date: "2024-01-09",
      icon: Settings,
      canComplain: true,
      canRepeat: true
    },
    {
      id: "TXN003",
      type: "DTH Recharge",
      operator: "Tata Sky",
      number: "****9012",
      amount: 299,
      status: "Pending",
      date: "2024-01-08",
      icon: Settings,
      canComplain: true,
      canRepeat: false
    }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === "all" || transaction.type.toLowerCase().includes(typeFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleComplaint = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowComplaintDialog(true);
  };

  const handleRepeat = (transaction: any) => {
    toast({
      title: "Repeat Transaction",
      description: `Repeating ${transaction.type} for ${transaction.operator}`,
    });
  };

  const handleShare = (transaction: any) => {
    const receiptText = `
GreenCharge Receipt
Transaction ID: ${transaction.id}
Type: ${transaction.type}
Operator: ${transaction.operator}
Amount: ₹${transaction.amount}
Status: ${transaction.status}
Date: ${transaction.date}
    `;
    
    if (navigator.share) {
      navigator.share({
        title: 'Transaction Receipt',
        text: receiptText,
      });
    } else {
      navigator.clipboard.writeText(receiptText);
      toast({
        title: "Receipt Copied",
        description: "Receipt details copied to clipboard",
      });
    }
  };

  const submitComplaint = () => {
    if (!complaintMessage.trim()) {
      toast({
        title: "Missing Message",
        description: "Please enter a complaint message",
        variant: "destructive"
      });
      return;
    }

    const complaintId = `CMP${Date.now()}`;
    
    // Simulate sending to admin panel
    toast({
      title: "Complaint Registered",
      description: `Complaint ID: ${complaintId}. We'll resolve this soon.`,
    });

    setShowComplaintDialog(false);
    setComplaintMessage("");
    setSelectedTransaction(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Transaction History" />
      
      <div className="p-4 space-y-4">
        {/* Search and Filters */}
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

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.map((transaction, index) => (
            <Card 
              key={transaction.id}
              className="p-4 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-light rounded-lg">
                  <transaction.icon size={20} className="text-green-primary" />
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {transaction.canComplain && (
                            <DropdownMenuItem onClick={() => handleComplaint(transaction)}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Raise Complaint
                            </DropdownMenuItem>
                          )}
                          {transaction.canRepeat && (
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
                        {transaction.operator} • {transaction.number}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date} • {transaction.id}
                      </p>
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

      {/* Complaint Dialog */}
      <Dialog open={showComplaintDialog} onOpenChange={setShowComplaintDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-primary">Raise Complaint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTransaction && (
              <Card className="p-3 bg-gray-50">
                <p className="text-sm"><strong>Transaction ID:</strong> {selectedTransaction.id}</p>
                <p className="text-sm"><strong>Type:</strong> {selectedTransaction.type}</p>
                <p className="text-sm"><strong>Amount:</strong> ₹{selectedTransaction.amount}</p>
              </Card>
            )}
            
            <div>
              <Label htmlFor="complaint">Complaint Message</Label>
              <Textarea
                id="complaint"
                placeholder="Describe your issue..."
                value={complaintMessage}
                onChange={(e) => setComplaintMessage(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={submitComplaint}
                className="flex-1 green-gradient text-white"
                disabled={!complaintMessage.trim()}
              >
                Submit Complaint
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowComplaintDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default History;
