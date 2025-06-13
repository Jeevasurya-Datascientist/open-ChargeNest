
import { useState } from "react";
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
import { 
  Users, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare
} from "lucide-react";

const AdminPanel = () => {
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [complaintResponse, setComplaintResponse] = useState("");
  const [showComplaintDialog, setShowComplaintDialog] = useState(false);
  const { toast } = useToast();

  // Mock data
  const stats = {
    totalUsers: 12450,
    totalTransactions: 89230,
    totalComplaints: 156,
    todayRevenue: 45620
  };

  const recentTransactions = [
    {
      id: "TXN001",
      userId: "USR123",
      type: "Mobile Recharge",
      operator: "Jio",
      amount: 199,
      commission: 3.98,
      status: "Success",
      date: "2024-01-10 14:30",
      phone: "9876543210"
    },
    {
      id: "TXN002",
      userId: "USR124",
      type: "Electricity Bill",
      operator: "MSEB",
      amount: 850,
      commission: 12.75,
      status: "Success",
      date: "2024-01-10 14:25",
      phone: "9876543211"
    },
    {
      id: "TXN003",
      userId: "USR125",
      type: "DTH Recharge",
      operator: "Tata Sky",
      amount: 299,
      commission: 4.49,
      status: "Pending",
      date: "2024-01-10 14:20",
      phone: "9876543212"
    }
  ];

  const complaints = [
    {
      id: "CMP001",
      transactionId: "TXN001",
      userId: "USR123",
      type: "Mobile Recharge",
      operator: "Jio",
      amount: 199,
      message: "Recharge was deducted but not credited to my number",
      status: "Open",
      date: "2024-01-10 15:00",
      userPhone: "9876543210"
    },
    {
      id: "CMP002",
      transactionId: "TXN045",
      userId: "USR150",
      type: "Bill Payment",
      operator: "MSEB",
      amount: 1200,
      message: "Bill payment failed but amount was deducted",
      status: "In Progress",
      date: "2024-01-10 12:30",
      userPhone: "9876543250"
    }
  ];

  const users = [
    {
      id: "USR123",
      name: "John Doe",
      phone: "9876543210",
      email: "john@example.com",
      walletBalance: 1250,
      totalSpent: 5640,
      joinDate: "2024-01-01",
      status: "Active"
    },
    {
      id: "USR124",
      name: "Jane Smith",
      phone: "9876543211",
      email: "jane@example.com",
      walletBalance: 890,
      totalSpent: 3200,
      joinDate: "2024-01-02",
      status: "Active"
    }
  ];

  const handleComplaintAction = (complaint: any, action: string) => {
    setSelectedComplaint(complaint);
    if (action === "resolve") {
      setShowComplaintDialog(true);
    } else if (action === "view") {
      // View complaint details
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
          <Button className="green-gradient text-white">
            Export Report
          </Button>
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
                <p className="text-2xl font-bold">₹{stats.todayRevenue.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
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
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.userId}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.operator}</TableCell>
                      <TableCell>₹{transaction.amount}</TableCell>
                      <TableCell>₹{transaction.commission}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.status === "Success" ? "default" : "secondary"}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {transaction.status === "Pending" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateTransactionStatus(transaction.id, "Success")}
                              >
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => updateTransactionStatus(transaction.id, "Failed")}
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
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
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Complaint ID</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.id}</TableCell>
                      <TableCell>{complaint.transactionId}</TableCell>
                      <TableCell>{complaint.userId}</TableCell>
                      <TableCell>{complaint.type}</TableCell>
                      <TableCell>₹{complaint.amount}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            complaint.status === "Open" ? "destructive" :
                            complaint.status === "In Progress" ? "secondary" : "default"
                          }
                        >
                          {complaint.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{complaint.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleComplaintAction(complaint, "view")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleComplaintAction(complaint, "resolve")}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">User Management</h2>
                <Input placeholder="Search users..." className="w-64" />
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Wallet Balance</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>₹{user.walletBalance}</TableCell>
                      <TableCell>₹{user.totalSpent}</TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>
                        <Badge variant="default">{user.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                    <span className="font-bold">₹45,620</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Week:</span>
                    <span className="font-bold">₹2,34,560</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month:</span>
                    <span className="font-bold">₹8,45,220</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Commission:</span>
                    <span className="font-bold">₹1,23,450</span>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Transaction Analytics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Mobile Recharges:</span>
                    <span className="font-bold">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bill Payments:</span>
                    <span className="font-bold">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DTH Recharges:</span>
                    <span className="font-bold">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Others:</span>
                    <span className="font-bold">5%</span>
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
