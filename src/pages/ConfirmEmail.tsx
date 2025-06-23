import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { applyActionCode } from "firebase/auth";
import { auth } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";

const ConfirmEmail = () => {
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const actionCode = queryParams.get('oobCode');

    if (!actionCode) {
      setStatus("error");
      toast({
        title: "Invalid Link",
        description: "The email confirmation link is invalid.",
        variant: "destructive",
      });
      return;
    }

    const handleConfirmEmail = async () => {
      try {
        await applyActionCode(auth, actionCode);
        setStatus("success");
        toast({
          title: "Email Confirmed",
          description: "Your email address has been successfully confirmed.",
        });
        // TODO: Save user data to dashboard/database here if needed
        // Example: saveUserData(auth.currentUser);
        setTimeout(() => {
          navigate("/"); // Navigate to home page after a delay
        }, 3000); // Navigate after 3 seconds
      } catch (error: any) {
        console.error("Email confirmation error:", error);
        setStatus("error");
        toast({
          title: "Confirmation Failed",
          description: error.message || "An error occurred while confirming your email.",
          variant: "destructive",
        });
      }
    };

    handleConfirmEmail();
  }, [location, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 text-center space-y-4">
        {status === "verifying" && (
          <>
            <div className="mx-auto w-12 h-12 border-4 border-t-4 border-green-primary border-solid rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold text-green-primary">Verifying Email...</h2>
            <p className="text-muted-foreground">Please wait while we confirm your email address.</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
            <h2 className="text-xl font-semibold text-green-600">Success!</h2>
            <p className="text-muted-foreground">Your email address has been confirmed. Redirecting to home...</p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-600" />
            <h2 className="text-xl font-semibold text-red-600">Confirmation Failed</h2>
            <p className="text-muted-foreground">There was an issue confirming your email. Please try again or contact support.</p>
          </>
        )}
      </Card>
    </div>
  );
};

export default ConfirmEmail;