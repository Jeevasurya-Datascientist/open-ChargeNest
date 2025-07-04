import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { Stripe } from 'https://esm.sh/stripe@14.5.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

// Create a Supabase client with the SERVICE_ROLE_KEY to bypass RLS for admin tasks
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')!
  const signingSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

  try {
    const body = await req.text()
    // Verify the event came from Stripe
    const event = await stripe.webhooks.constructEventAsync(
      body, signature, signingSecret, undefined, Stripe.createSubtleCryptoProvider()
    )

    // Handle only the 'payment_intent.succeeded' event
    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object
      const userId = intent.metadata.userId
      const amount = intent.amount_received // Use amount_received for accuracy

      if (!userId || !amount) {
        throw new Error('Webhook received without userId or amount in metadata.')
      }
      
      // Use a Postgres function (RPC) for a safe, atomic transaction
      const { error } = await supabaseAdmin.rpc('add_to_wallet', {
          user_id_input: userId,
          amount_input: amount // amount is already in paise (smallest unit)
      });

      if (error) {
        throw new Error(`Failed to update wallet for user ${userId}: ${error.message}`)
      }
      
      console.log(`Webhook success: Credited ${amount} to user ${userId}.`)
    } else {
      console.log(`Received unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    console.error('Webhook Error:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
})