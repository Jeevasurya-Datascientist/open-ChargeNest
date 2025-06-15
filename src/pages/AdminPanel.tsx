
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp, 
  MessageSquare,
  Bell,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const [showCreateNotification, setShowCreateNotification] = useState(false);
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    type: "info"
  });

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    pendingComplaints: 0
  });

  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    loadRealTimeData();
  }, []);

  const loadRealTimeData = () => {
    // Load real data from localStorage
    const transactionHistory = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const walletTransactions = JSON.parse(localStorage.getItem('walletTransactions') || '[]');
    const savedNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');

    // Calculate stats
    const totalRevenue = transactionHistory.reduce((sum: number, t: any) => sum + (t.commission || 0), 0);
    const pendingTransactions = transactionHistory.filter((t: any) => t.status === 'Pending').length;

    setStats({
      totalUsers: userData.name ? 1 : 0,
      totalTransactions: transactionHistory.length,
      totalRevenue: totalRevenue,
      pendingComplaints: pendingTransactions
    });

    setTransactions(transactionHistory);
    setUsers(userData.name ? [userData] : []);
    setComplaints(transactionHistory.filter((t: any) => t.status === 'Failed' || t.status === 'Pending'));
    setNotifications(savedNotifications);
  };

  const handleCreateNotification = () => {
    if (!notification.title || !notification.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newNotification = {
      id: Date.now().toString(),
      title: notification.title,
      message: notification.message,
      type: notification.type,
      timestamp: new Date().toISOString(),
      sentToUsers: stats.totalUsers
    };

    // Save to admin notifications
    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));

    // Send to all users
    const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '[]');
    userNotifications.push(newNotification);
    localStorage.setItem('userNotifications', JSON.stringify(userNotifications));

    toast({
      title: "Notification Sent",
      description: `Notification sent to ${stats.totalUsers} user(s)`,
    });

    setNotification({ title: "", message: "", type: "info" });
    setShowCreateNotification(false);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Header title="Admin Panel" showProfile={false} showNotifications={false} />
      
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{stats.totalTransactions}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Issues</p>
                <p className="text-2xl font-bold">{stats.pendingComplaints}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Notification Management */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center space-x-2">
              <Bell size={24} />
              <span>Notification Management</span>
            </h2>
            <Button onClick={() => setShowCreateNotification(true)}>
              <Plus size={16} className="mr-2" />
              Create Notification
            </Button>
          </div>
          
          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{notif.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{notif.type}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Sent to {notif.sentToUsers} users on {new Date(notif.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No notifications sent yet</p>
            )}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <CreditCard size={24} />
            <span>Recent Transactions</span>
          </h2>
          <div className="space-y-2">
            {transactions.slice(0, 5).map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.status === 'Success' ? 'bg-green-100' : 
                    transaction.status === 'Pending' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {transaction.status === 'Success' ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : transaction.status === 'Pending' ? (
                      <Clock size={16} className="text-yellow-600" />
                    ) : (
                      <XCircle size={16} className="text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.operator} • {transaction.fullNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{transaction.amount}</p>
                  <p className="text-xs text-green-600">
                    Commission: ₹{(transaction.commission || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* User Management */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Users size={24} />
            <span>User Management</span>
          </h2>
          <div className="space-y-3">
            {users.map((user, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye size={16} className="mr-2" />
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Create Notification Dialog */}
      <Dialog open={showCreateNotification} onOpenChange={setShowCreateNotification}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Notification Title</Label>
              <Input
                id="title"
                value={notification.title}
                onChange={(e) => setNotification(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter notification title"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={notification.message}
                onChange={(e) => setNotification(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter notification message"
                rows={4}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCreateNotification} className="flex-1">
                Send Notification
              </Button>
              <Button variant="outline" onClick={() => setShowCreateNotification(false)}>
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
