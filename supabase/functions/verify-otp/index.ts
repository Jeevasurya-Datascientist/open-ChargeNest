
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyOTPRequest {
  phoneNumber: string;
  otp: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, otp }: VerifyOTPRequest = await req.json();
    
    console.log(`🔐 Verifying OTP for number: ${phoneNumber}, OTP: ${otp}`);
    
    if (!phoneNumber || !otp) {
      console.log('❌ Missing phone number or OTP');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Phone number and OTP are required' 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Clean phone number
    const cleanedNumber = phoneNumber.replace(/[\s\-\+]/g, '').replace(/^91/, '');
    console.log(`📱 Cleaned number: ${cleanedNumber}`);
    
    // Initialize global store if it doesn't exist
    if (!globalThis.otpStore) {
      console.log('🔄 Initializing OTP store');
      globalThis.otpStore = new Map();
    }
    
    // Debug: Log all stored OTPs
    console.log('📋 Current OTP store contents:', Array.from(globalThis.otpStore.entries()));
    
    // Get OTP from memory store
    const storedOtpData = globalThis.otpStore.get(cleanedNumber);
    
    if (!storedOtpData) {
      console.log(`❌ No OTP found for ${cleanedNumber}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OTP not found or expired. Please request a new OTP.' 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log(`🔍 Found stored OTP data for ${cleanedNumber}:`, storedOtpData);
    
    // Check if OTP is expired
    if (Date.now() > storedOtpData.expiresAt) {
      console.log(`⏰ OTP expired for ${cleanedNumber}`);
      globalThis.otpStore.delete(cleanedNumber);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OTP has expired. Please request a new OTP.' 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Verify OTP (convert both to strings for comparison)
    const storedOtp = String(storedOtpData.otp);
    const providedOtp = String(otp);
    
    console.log(`🔐 Comparing OTPs - Stored: ${storedOtp}, Provided: ${providedOtp}`);
    
    if (storedOtp === providedOtp) {
      // Remove OTP after successful verification
      globalThis.otpStore.delete(cleanedNumber);
      
      console.log(`✅ OTP verified successfully for ${cleanedNumber}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP verified successfully' 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      console.log(`❌ Invalid OTP for ${cleanedNumber}. Expected: ${storedOtp}, Got: ${providedOtp}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid OTP. Please check and try again.' 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('❌ Error verifying OTP:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to verify OTP. Please try again.' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
