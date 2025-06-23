// src/components/auth/RealtimeNotificationListener.tsx

import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from "sonner";

// Define the shape of a notification payload from Supabase
interface INotification {
  id: number;
  created_at: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const RealtimeNotificationListener = () => {
  useEffect(() => {
    // This function sets up the real-time subscription
    const setupSubscription = () => {
      const channel = supabase
        .channel('public:notifications') // A unique name for the channel
        .on(
          'postgres_changes', // Listen to database changes
          { 
            event: 'INSERT',          // Specifically on INSERT events
            schema: 'public',         // In the 'public' schema
            table: 'notifications'    // On the 'notifications' table
          },
          (payload) => {
            console.log('Real-time notification received!', payload);
            const newNotification = payload.new as INotification;

            // Use Sonner to display a dynamic toast
            sonnerToast(newNotification.title, {
              description: newNotification.message,
              // You can add more dynamic options here if needed
              // e.g., sonnerToast.success(), sonnerToast.error()
            });
          }
        )
        .subscribe();

      // Return the channel so we can unsubscribe from it
      return channel;
    };

    const channel = setupSubscription();

    // The cleanup function runs when the component unmounts
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []); // The empty dependency array ensures this runs only once

  // This component does not render any visible UI
  return null;
};

export default RealtimeNotificationListener;