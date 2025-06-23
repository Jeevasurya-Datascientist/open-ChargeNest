// src/pages/AdminPanel.tsx

import { useState, useEffect, useCallback, useMemo } from "react";
import { Users, CreditCard, AlertTriangle, TrendingUp, Bell, Plus, Loader2, Search, Wallet as WalletIcon, Slash, UserCheck, UserX, Settings as SettingsIcon, LayoutDashboard } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge, badgeVariants } from "@/components/ui/badge"; // Import badgeVariants if needed for specific styling
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { AuthManager } from "@/utils/authManager";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/supabase";
import { Skeleton } from "@/components/ui/skeleton";

// --- TYPE DEFINITIONS ---
type UserProfile = Database['public']['Tables']['profiles']['Row'];
type Transaction = Database['public']['Tables']['transactions']['Row'] & { profiles: Pick<UserProfile, 'full_name'> | null };
type Notification = Database['public']['Tables']['notifications']['Row'];

// --- ANIMATION VARIANTS ---
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.2 } };

const AdminPanel = () => {
  // --- STATE MANAGEMENT ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState({ dashboard: true, users: true, transactions: true, notifications: true });
  const { toast } = useToast();

  const [stats, setStats] = useState({ totalUsers: 0, totalTransactions: 0, totalRevenue: 0 });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pastNotifications, setPastNotifications] = useState<Notification[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateNotification, setShowCreateNotification] = useState(false);
  const [notification, setNotification] = useState({ title: "", message: "", type: "info" });
  
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ phone: "", password: "" });

  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [walletAmount, setWalletAmount] = useState<number | string>("");
  
  const [userSearch, setUserSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 10;
  
  const chartData = useMemo(() => {
    // In a production app, this data would come from an RPC call to your database
    return [
      { name: 'Mon', revenue: stats.totalRevenue * 0.1, transactions: stats.totalTransactions * 0.1 },
      { name: 'Tue', revenue: stats.totalRevenue * 0.15, transactions: stats.totalTransactions * 0.2 },
      { name: 'Wed', revenue: stats.totalRevenue * 0.2, transactions: stats.totalTransactions * 0.15 },
      { name: 'Thu', revenue: stats.totalRevenue * 0.12, transactions: stats.totalTransactions * 0.18 },
      { name: 'Fri', revenue: stats.totalRevenue * 0.25, transactions: stats.totalTransactions * 0.22 },
      { name: 'Sat', revenue: stats.totalRevenue * 0.08, transactions: stats.totalTransactions * 0.1 },
      { name: 'Sun', revenue: stats.totalRevenue * 0.1, transactions: stats.totalTransactions * 0.05 },
    ]
  }, [stats]);


  // --- DATA FETCHING & REAL-TIME ---
  const fetchData = useCallback(async (isRealtimeUpdate = false) => {
    if(!isRealtimeUpdate) setIsLoading({ dashboard: true, users: true, transactions: true, notifications: true });

    const [usersRes, transactionsRes, notificationsRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false }),
        supabase.from('transactions').select(`*, profiles!inner(full_name)`),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(10)
    ]);
    
    if (usersRes.data) setUsers(usersRes.data);
    if (transactionsRes.data) {
        setTransactions(transactionsRes.data as unknown as Transaction[]); // Cast because of join
        const totalCommission = transactionsRes.data.reduce((sum, tx) => sum + (tx.commission || 0), 0);
        setStats({ totalUsers: usersRes.count ?? 0, totalTransactions: transactionsRes.data.length, totalRevenue: totalCommission });
    }
    if (notificationsRes.data) setPastNotifications(notificationsRes.data);

    setIsLoading({ dashboard: false, users: false, transactions: false, notifications: false });
    if(isRealtimeUpdate) toast({title: "Live Update", description: "Dashboard data has been synchronized."});
  }, [toast]);

  useEffect(() => {
    const loggedIn = AuthManager.isAdminLoggedIn();
    setIsAdmin(loggedIn);
    if (!loggedIn) return;

    fetchData();

    const realtimeChannel = supabase.channel('admin-dashboard-realtime')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => fetchData(true))
        .subscribe();

    return () => { supabase.removeChannel(realtimeChannel); };
  }, [fetchData]);
  
  // --- ACTION HANDLERS ---
  const handleUpdateWallet = async () => {
    if (!selectedUser || !walletAmount) return;
    setIsSubmitting(true);
    const amount = typeof walletAmount === 'string' ? parseFloat(walletAmount) : walletAmount;
    const newBalance = (selectedUser.wallet_balance ?? 0) + amount;
    const { error } = await supabase.from('profiles').update({ wallet_balance: newBalance }).eq('id', selectedUser.id);
    setIsSubmitting(false);
    if (error) { toast({ title: "Update Failed", variant: "destructive" }); }
    else {
      toast({ title: "Success", description: `Wallet updated.`});
      setWalletAmount("");
      setSelectedUser(prev => prev ? {...prev, wallet_balance: newBalance} : null);
    }
  };

  const handleToggleBlockUser = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    const newBlockedState = !selectedUser.is_blocked;
    const { error } = await supabase.from('profiles').update({ is_blocked: newBlockedState }).eq('id', selectedUser.id);
    setIsSubmitting(false);
    if (error) { toast({ title: "Action Failed", variant: "destructive" }); }
    else {
      toast({ title: "Success", description: `User has been ${newBlockedState ? 'blocked' : 'unblocked'}.`});
      setSelectedUser(prev => prev ? {...prev, is_blocked: newBlockedState} : null);
    }
  };

  const handleCreateNotification = async () => {
    if (!notification.title || !notification.message) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('notifications').insert({ ...notification });
    setIsSubmitting(false);
    if (error) { toast({ title: "Failed to Send", description: error.message, variant: "destructive" }); }
    else {
      toast({ title: "Notification Sent!" });
      setShowCreateNotification(false);
      setNotification({ title: "", message: "", type: "info" });
      fetchData();
    }
  };
  
  const handleAddAdmin = () => {
    if (!newAdmin.phone || !newAdmin.password) return;
    AuthManager.addAdmin(newAdmin.phone, newAdmin.password);
    toast({ title: "Admin Added", description: `New admin added.` });
    setShowAddAdminDialog(false);
    setNewAdmin({ phone: "", password: "" });
  };

  // --- MEMOIZED COMPUTATIONS ---
  const filteredUsers = useMemo(() => users.filter(user => 
    user.full_name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email?.toLowerCase().includes(userSearch.toLowerCase())
  ), [users, userSearch]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  // --- RENDER LOGIC ---
  if (!isAdmin) {
    return <div className="min-h-screen bg-background p-4 flex items-center justify-center"><div className="text-center"><AlertTriangle className="mx-auto h-12 w-12 text-destructive" /><h1 className="mt-4 text-2xl font-bold">Access Denied</h1></div></div>;
  }

  const renderSkeleton = (count: number) => Array.from({ length: count }).map((_, i) => <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell></TableRow>);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div key="dashboard" {...pageVariants} className="space-y-6">
            <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}><Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Revenue (Commission)</CardTitle><TrendingUp className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent>{isLoading.dashboard ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</div>}</CardContent></Card></motion.div>
                <motion.div variants={itemVariants}><Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent>{isLoading.dashboard ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.totalUsers}</div>}</CardContent></Card></motion.div>
                <motion.div variants={itemVariants}><Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Transactions</CardTitle><CreditCard className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent>{isLoading.dashboard ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.totalTransactions}</div>}</CardContent></Card></motion.div>
                <motion.div variants={itemVariants}><Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pending Issues</CardTitle><AlertTriangle className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">0</div></CardContent></Card></motion.div>
            </motion.div>
            <motion.div variants={itemVariants}><Card><CardHeader><CardTitle>Revenue Overview</CardTitle></CardHeader><CardContent className="pl-2 h-[350px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}} /><Legend /><Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer></CardContent></Card></motion.div>
          </motion.div>
        );
      case 'users':
        return (
          <motion.div key="users" {...pageVariants}>
            <Card><CardHeader><CardTitle>User Management</CardTitle><CardDescription>View, search, and manage all platform users.</CardDescription></CardHeader>
                <CardContent>
                    <div className="flex items-center py-4"><div className="relative w-full max-w-sm"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><Input placeholder="Search by name or email..." className="pl-10" value={userSearch} onChange={e => {setUserSearch(e.target.value); setCurrentPage(1);}} /></div></div>
                    <div className="rounded-md border">
                      <Table><TableHeader><TableRow><TableHead>User</TableHead><TableHead className="hidden md:table-cell">Status</TableHead><TableHead className="hidden sm:table-cell">Joined On</TableHead><TableHead className="text-right">Wallet Balance</TableHead></TableRow></TableHeader>
                        <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                            {isLoading.users ? renderSkeleton(USERS_PER_PAGE) : paginatedUsers.map(user => (
                                <motion.tr key={user.id} variants={itemVariants} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelectedUser(user)}>
                                    <TableCell><div className="font-medium">{user.full_name ?? "N/A"}</div><div className="text-sm text-muted-foreground">{user.email}</div></TableCell>
                                    <TableCell className="hidden md:table-cell"><Badge variant={user.is_blocked ? "destructive" : "default"}>{user.is_blocked ? "Blocked" : "Active"}</Badge></TableCell>
                                    <TableCell className="hidden sm:table-cell">{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right font-mono text-lg">₹{user.wallet_balance?.toFixed(2) ?? '0.00'}</TableCell>
                                </motion.tr>
                            ))}
                        </motion.tbody>
                      </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4"><Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Previous</Button><span className="text-sm font-medium">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages}>Next</Button></div>
                </CardContent>
            </Card>
          </motion.div>
        );
      case 'transactions':
         return (
            <motion.div key="transactions" {...pageVariants}>
                <Card><CardHeader><CardTitle>All Transactions</CardTitle><CardDescription>A log of all transactions processed on the platform.</CardDescription></CardHeader>
                <CardContent>
                    {isLoading.transactions ? <div className="p-8"><Skeleton className="h-64 w-full"/></div> :
                    <div className="rounded-md border"><Table><TableHeader><TableRow><TableHead>User</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                        <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                            {transactions.slice(0, 50).map(tx => (
                                <motion.tr key={tx.id} variants={itemVariants}>
                                    <TableCell>{tx.profiles?.full_name}</TableCell><TableCell>{tx.recharge_type ?? "N/A"}</TableCell>
                                    <TableCell>₹{tx.amount ?? 0}</TableCell>
                                    <TableCell><Badge variant={tx.status === 'Success' ? 'default' : tx.status === 'Failed' ? 'destructive' : 'secondary'}>{tx.status}</Badge></TableCell>
                                    <TableCell>{new Date(tx.created_at).toLocaleString()}</TableCell>
                                </motion.tr>
                            ))}
                        </motion.tbody>
                    </Table></div>}
                </CardContent></Card>
            </motion.div>
        );
      case 'settings':
        return (
            <motion.div key="settings" {...pageVariants} className="space-y-6">
                <Card><CardHeader><CardTitle>System Settings</CardTitle></CardHeader><CardContent className="grid md:grid-cols-2 gap-6 pt-6">
                    <div className="space-y-2"><h3 className="font-semibold">Manage Admins</h3><p className="text-sm text-muted-foreground">Add new administrators to the system.</p><Button onClick={() => setShowAddAdminDialog(true)}>Add New Admin</Button></div>
                    <div className="space-y-2"><h3 className="font-semibold">Send Global Notification</h3><p className="text-sm text-muted-foreground">Broadcast a message to all active users.</p><Button onClick={() => setShowCreateNotification(true)}>Create Notification</Button></div>
                </CardContent></Card>
                 <Card><CardHeader><CardTitle>Past Notifications</CardTitle></CardHeader><CardContent className="space-y-3 pt-6">
                 {isLoading.notifications ? <Skeleton className="h-40 w-full" /> :
                  pastNotifications.length > 0 ? (pastNotifications.map((notif) => (<Card key={notif.id} className="p-4 bg-muted/50"><div><h3 className="font-semibold">{notif.title}</h3><p className="text-sm text-muted-foreground mb-2">{notif.message}</p><div className="flex items-center space-x-2"><Badge variant="secondary">{notif.type}</Badge><span className="text-xs text-muted-foreground">{new Date(notif.created_at).toLocaleString()}</span></div></div></Card>)))
                  : (<p className="text-center text-muted-foreground py-8">No notifications sent yet.</p>)}</CardContent></Card>
            </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header title="Admin Dashboard" showProfile={false} showNotifications={false} />
      <main className="p-4 md:p-8 pb-24">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border/40 backdrop-blur-sm z-10">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          {[{id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard'}, {id: 'users', icon: Users, label: 'Users'}, {id: 'transactions', icon: CreditCard, label: 'Transactions'}, {id: 'settings', icon: SettingsIcon, label: 'Settings'}].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} type="button" className={`inline-flex flex-col items-center justify-center px-5 hover:bg-muted/50 group transition-colors ${activeTab === item.id ? 'text-primary' : 'text-muted-foreground'}`}>
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
      
      <Dialog open={!!selectedUser} onOpenChange={(isOpen) => !isOpen && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>{selectedUser?.full_name}</DialogTitle><CardDescription>{selectedUser?.email}</CardDescription></DialogHeader>
            <div className="py-4 space-y-6">
                <div className="space-y-2"><Label>Manage Wallet (Current: ₹{selectedUser?.wallet_balance?.toFixed(2)})</Label><div className="flex gap-2"><Input type="number" placeholder="e.g., 50 or -20" value={walletAmount} onChange={e => setWalletAmount(e.target.value)} /><Button onClick={handleUpdateWallet} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Update"}</Button></div></div>
                <div className="space-y-2"><Label>Account Actions</Label><Button variant="destructive" className="w-full justify-start" onClick={handleToggleBlockUser} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : selectedUser?.is_blocked ? <UserCheck className="mr-2 h-4 w-4"/> : <UserX className="mr-2 h-4 w-4"/>}
                    {selectedUser?.is_blocked ? "Unblock User Account" : "Block User Account"}
                </Button></div>
            </div>
            <DialogFooter><Button variant="secondary" onClick={() => setSelectedUser(null)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;