import { supabase } from "@/integrations/supabase/client";

export class OTPService {
  private static TESTING_NUMBER = "6382791350";

  static async sendOTP(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
    // Skip OTP for testing number
    if (phoneNumber === this.TESTING_NUMBER) {
      console.log(`Bypassing OTP for testing number: ${phoneNumber}`);
      return { success: true };
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber }
      });

      if (error) {
        console.error('Error sending OTP:', error);
        return { success: false, error: error.message };
      }

      if (!data.success) {
        return { success: false, error: data.error };
      }

      return { success: true };
    } catch (error) {
      console.error('Network error sending OTP:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }

  static async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; error?: string }> {
    // Skip OTP verification for testing number
    if (phoneNumber === this.TESTING_NUMBER) {
      console.log(`Bypassing OTP verification for testing number: ${phoneNumber}`);
      return { success: true };
    }

    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { phoneNumber, otp }
      });

      if (error) {
        console.error('Error verifying OTP:', error);
        return { success: false, error: error.message };
      }

      if (!data.success) {
        return { success: false, error: data.error };
      }

      return { success: true };
    } catch (error) {
      console.error('Network error verifying OTP:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  }
}
