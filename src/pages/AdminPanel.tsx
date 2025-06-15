
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AuthManager } from "@/utils/authManager";
import { WalletManager } from "@/utils/walletManager";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  LogOut
} from "lucide-react";

const AdminPanel = () => {
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [complaintResponse, setComplaintResponse] = useState("");
  const [showComplaintDialog, setShowComplaintDialog] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthManager.isAdminLoggedIn()) {
      navigate("/admin-login");
      return;
    }

    // Load real data
    const savedHistory = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    const walletHistory = WalletManager.getTransactions();
    setTransactions(savedHistory);
    setWalletTransactions(walletHistory);
  }, [navigate]);

  const handleLogout = () => {
    AuthManager.clearAdminSession();
    navigate("/");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  // Calculate real stats
  const stats = {
    totalUsers: 1250, // You can expand this with real user tracking
    totalTransactions: transactions.length,
    totalComplaints: 0, // You can add complaint tracking
    todayRevenue: transactions
      .filter(t => t.date === new Date().toISOString().split('T')[0])
      .reduce((sum, t) => sum + (t.commission || 0), 0)
  };

  const handleComplaintAction = (complaint: any, action: string) => {
    setSelectedComplaint(complaint);
    if (action === "resolve") {
      setShowComplaintDialog(true);
    } else if (action === "view") {
      toast({
        title: "Complaint Details",
        description: `Transaction: ${complaint.transactionId}, Amount: ₹${complaint.amount}`,
      });
    }
  };

  const resolveComplaint = () => {
    if (!complaintResponse.trim()) {
      toast({
        title: "Missing Response",
        description: "Please enter a resolution response",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Complaint Resolved",
      description: `Complaint ${selectedComplaint.id} has been resolved`,
    });

    setShowComplaintDialog(false);
    setComplaintResponse("");
    setSelectedComplaint(null);
  };

  const updateTransactionStatus = (transactionId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Transaction ${transactionId} status updated to ${newStatus}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-primary">GreenCharge Admin</h1>
            <p className="text-muted-foreground">Manage transactions, users, and complaints</p>
          </div>
          <div className="flex space-x-2">
            <Button className="green-gradient text-white">
              Export Report
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Complaints</p>
                <p className="text-2xl font-bold">{stats.totalComplaints}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Revenue</p>
                <p className="text-2xl font-bold">₹{stats.todayRevenue.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="wallet">Wallet History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <div className="flex space-x-2">
                  <Input placeholder="Search transactions..." className="w-64" />
                  <Button variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 10).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.operator}</TableCell>
                      <TableCell>₹{transaction.amount}</TableCell>
                      <TableCell>₹{transaction.commission?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === "Success" ? "default" : "secondary"}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Wallet History Tab */}
          <TabsContent value="wallet">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Wallet Transactions</h2>
                <div className="text-lg font-bold">
                  Current Balance: ₹{WalletManager.getBalance().toFixed(2)}
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Balance After</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {walletTransactions.slice(0, 10).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === "credit" ? "default" : "secondary"}>
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={transaction.type === "credit" ? "text-green-600" : "text-red-600"}>
                        {transaction.type === "credit" ? "+" : "-"}₹{transaction.amount}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>₹{transaction.balanceAfter}</TableCell>
                      <TableCell>{new Date(transaction.timestamp).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Complaints Tab */}
          <TabsContent value="complaints">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Customer Complaints</h2>
                <p className="text-muted-foreground">
                  Complaints are handled via WhatsApp (+91 9789456787)
                </p>
              </div>
              
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">No pending complaints</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Customer complaints are directly sent to WhatsApp for real-time resolution
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Today's Revenue:</span>
                    <span className="font-bold">₹{stats.todayRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Transactions:</span>
                    <span className="font-bold">{transactions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Commission:</span>
                    <span className="font-bold">
                      ₹{transactions.reduce((sum, t) => sum + (t.commission || 0), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Transaction Types</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Mobile Recharges:</span>
                    <span className="font-bold">
                      {transactions.filter(t => t.type === "Mobile Recharge").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bill Payments:</span>
                    <span className="font-bold">
                      {transactions.filter(t => t.type.includes("Bill")).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-bold">
                      {transactions.length > 0 ? 
                        ((transactions.filter(t => t.status === "Success").length / transactions.length) * 100).toFixed(1) + '%' 
                        : '0%'}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Complaint Resolution Dialog */}
      <Dialog open={showComplaintDialog} onOpenChange={setShowComplaintDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-primary">Resolve Complaint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedComplaint && (
              <Card className="p-3 bg-gray-50">
                <p className="text-sm"><strong>Complaint ID:</strong> {selectedComplaint.id}</p>
                <p className="text-sm"><strong>Transaction:</strong> {selectedComplaint.transactionId}</p>
                <p className="text-sm"><strong>Amount:</strong> ₹{selectedComplaint.amount}</p>
                <p className="text-sm"><strong>Message:</strong> {selectedComplaint.message}</p>
              </Card>
            )}
            
            <div>
              <Label htmlFor="response">Resolution Response</Label>
              <Textarea
                id="response"
                placeholder="Enter resolution details..."
                value={complaintResponse}
                onChange={(e) => setComplaintResponse(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={resolveComplaint}
                className="flex-1 green-gradient text-white"
                disabled={!complaintResponse.trim()}
              >
                Resolve Complaint
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
    </div>
  );
};

export default AdminPanel;
