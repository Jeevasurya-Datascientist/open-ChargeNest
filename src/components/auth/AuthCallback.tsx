import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // This listener is triggered when the user is signed in via the confirmation link
      if (event === 'SIGNED_IN' && session) {
        toast({
          title: "Email Confirmed!",
          description: "You have been successfully logged in.",
        });
        // Redirect the user to the home page after successful confirmation
        navigate('/');
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-muted-foreground">
        Confirming your account, please wait...
      </p>
    </div>
  );
};

export default AuthCallback;