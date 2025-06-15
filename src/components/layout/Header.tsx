
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  showProfile?: boolean;
  showNotifications?: boolean;
}

const Header = ({ 
  title = "GreenCharge", 
  showProfile = false, 
  showNotifications = true 
}: HeaderProps) => {
  return (
    <header className="bg-white dark:bg-card border-b border-gray-200 dark:border-border sticky top-0 z-40">
      <div className="flex items-center justify-between p-4 max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-primary to-green-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <h1 className="text-xl font-bold text-green-primary">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {showNotifications && (
            <Button variant="ghost" size="sm" className="p-2">
              <Bell size={20} className="text-green-primary" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
