
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
  gradient?: boolean;
}

const ServiceCard = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  onClick, 
  className = "",
  gradient = false 
}: ServiceCardProps) => {
  return (
    <Card 
      className={`p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${
        gradient ? "green-gradient text-white" : "bg-white"
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className={`p-3 rounded-full ${
          gradient 
            ? "bg-white/20 backdrop-blur-sm" 
            : "bg-green-light"
        }`}>
          <Icon 
            size={24} 
            className={gradient ? "text-white" : "text-green-primary"} 
          />
        </div>
        <div>
          <h3 className={`font-semibold text-sm ${
            gradient ? "text-white" : "text-green-primary"
          }`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`text-xs mt-1 ${
              gradient ? "text-white/80" : "text-muted-foreground"
            }`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
