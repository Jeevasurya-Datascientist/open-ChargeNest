
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
    
    // Get OTP from memory store
    globalThis.otpStore = globalThis.otpStore || new Map();
    const storedOtpData = globalThis.otpStore.get(phoneNumber);
    
    if (!storedOtpData) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OTP not found or expired' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Check if OTP is expired
    if (Date.now() > storedOtpData.expiresAt) {
      globalThis.otpStore.delete(phoneNumber);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'OTP has expired' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Verify OTP
    if (storedOtpData.otp === otp) {
      // Remove OTP after successful verification
      globalThis.otpStore.delete(phoneNumber);
      
      console.log(`OTP verified successfully for ${phoneNumber}`);
      
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
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid OTP' 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
