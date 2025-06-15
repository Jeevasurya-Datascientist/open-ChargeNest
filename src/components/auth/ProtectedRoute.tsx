
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthManager } from "@/utils/authManager";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthManager.getCurrentUser();
    
    if (!user) {
      navigate("/login");
      return;
    }

    if (requireAdmin && user.role !== "admin") {
      navigate("/login");
      return;
    }
  }, [navigate, requireAdmin]);

  const user = AuthManager.getCurrentUser();
  
  if (!user) {
    return null;
  }

  if (requireAdmin && user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
