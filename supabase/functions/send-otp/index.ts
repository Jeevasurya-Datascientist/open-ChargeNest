
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendOTPRequest {
  phoneNumber: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber }: SendOTPRequest = await req.json();
    
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');
    
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      throw new Error('Missing Twilio credentials');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in memory with expiration (5 minutes)
    const otpData = {
      otp,
      phoneNumber,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };
    
    // In a real implementation, you'd want to store this in a database
    // For now, we'll use a simple in-memory store
    globalThis.otpStore = globalThis.otpStore || new Map();
    globalThis.otpStore.set(phoneNumber, otpData);
    
    console.log(`Generated OTP for ${phoneNumber}: ${otp}`);
    
    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const twilioAuth = btoa(`${accountSid}:${authToken}`);
    
    const formData = new URLSearchParams();
    formData.append('From', twilioPhoneNumber);
    formData.append('To', `+91${phoneNumber}`);
    formData.append('Body', `Your GreenCharge verification code is: ${otp}. This code will expire in 5 minutes.`);
    
    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${twilioAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
    
    if (!twilioResponse.ok) {
      const error = await twilioResponse.text();
      console.error('Twilio error:', error);
      throw new Error('Failed to send SMS');
    }
    
    const result = await twilioResponse.json();
    console.log('SMS sent successfully:', result.sid);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        sid: result.sid 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
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
