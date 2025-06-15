
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AuthManager } from "@/utils/authManager";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!phone || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both phone and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (AuthManager.validateAdmin(phone, password)) {
        AuthManager.setAdminSession();
        toast({
          title: "Login Successful",
          description: "Welcome to Admin Panel",
        });
        navigate("/admin");
      } else {
        toast({
          title: "Invalid Credentials",
          description: "Phone number or password is incorrect",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="p-0">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-green-primary">Admin Login</h1>
          <div></div>
        </div>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-green-primary" />
          </div>
          <p className="text-gray-600">Secure admin access</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter admin phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button
            onClick={handleLogin}
            className="w-full green-gradient text-white"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
