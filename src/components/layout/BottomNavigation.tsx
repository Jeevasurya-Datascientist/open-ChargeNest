
import { Home, History, Settings, User, Wallet } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: History, label: "History", path: "/history" },
    { icon: Wallet, label: "Wallet", path: "/wallet" },
    { icon: Settings, label: "Offers", path: "/offers" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 min-w-0 transition-all duration-200 ${
                isActive 
                  ? "text-green-primary" 
                  : "text-muted-foreground hover:text-green-secondary"
              }`}
            >
              <div className={`p-1 rounded-lg transition-all duration-200 ${
                isActive ? "bg-green-light scale-110" : ""
              }`}>
                <Icon 
                  size={20} 
                  className={`transition-all duration-200 ${
                    isActive ? "stroke-2" : "stroke-1.5"
                  }`} 
                />
              </div>
              <span className={`text-xs mt-1 font-medium ${
                isActive ? "text-green-primary" : "text-muted-foreground"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
