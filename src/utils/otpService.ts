
import { supabase } from "@/integrations/supabase/client";

export class OTPService {
  private static TESTING_NUMBER = "6382791350";

  static async sendOTP(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
    // Clean phone number (remove any spaces, dashes, or country codes)
    const cleanedNumber = phoneNumber.replace(/[\s\-\+]/g, '').replace(/^91/, '');
    
    console.log(`📱 Sending OTP for number: ${phoneNumber}, cleaned: ${cleanedNumber}`);
    
    // Skip OTP for testing number
    if (cleanedNumber === this.TESTING_NUMBER) {
      console.log(`✅ Bypassing OTP send for testing number: ${phoneNumber}`);
      return { success: true };
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber: cleanedNumber }
      });

      console.log('OTP send response:', { data, error });

      if (error) {
        console.error('Error sending OTP:', error);
        return { success: false, error: error.message || 'Failed to send OTP' };
      }

      if (data && !data.success) {
        console.error('OTP send failed:', data.error);
        return { success: false, error: data.error || 'Failed to send OTP' };
      }

      console.log('✅ OTP sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Network error sending OTP:', error);
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  }

  static async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; error?: string }> {
    // Clean phone number (remove any spaces, dashes, or country codes)
    const cleanedNumber = phoneNumber.replace(/[\s\-\+]/g, '').replace(/^91/, '');
    
    console.log(`🔐 Verifying OTP for number: ${phoneNumber}, cleaned: ${cleanedNumber}, OTP: ${otp}`);
    
    // Skip OTP verification for testing number - accept any 6-digit code
    if (cleanedNumber === this.TESTING_NUMBER) {
      console.log(`✅ Bypassing OTP verification for testing number: ${phoneNumber}`);
      if (otp && otp.length === 6 && /^\d{6}$/.test(otp)) {
        return { success: true };
      } else {
        return { success: false, error: 'Please enter a valid 6-digit code' };
      }
    }

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return { success: false, error: 'Please enter a valid 6-digit OTP' };
    }

    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { phoneNumber: cleanedNumber, otp }
      });

      console.log('OTP verify response:', { data, error });

      if (error) {
        console.error('Error verifying OTP:', error);
        return { success: false, error: error.message || 'Failed to verify OTP' };
      }

      if (data && !data.success) {
        console.error('OTP verification failed:', data.error);
        return { success: false, error: data.error || 'Invalid OTP' };
      }

      console.log('✅ OTP verified successfully');
      return { success: true };
    } catch (error) {
      console.error('Network error verifying OTP:', error);
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
  }
}
