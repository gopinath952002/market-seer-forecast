
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@2.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get unnotified predictions
    const { data: predictions, error: fetchError } = await supabase
      .from('stock_predictions')
      .select('*, auth.users!inner(email)')
      .eq('notified', false)

    if (fetchError) throw fetchError

    for (const prediction of predictions) {
      // Fetch current stock price (mock for now, replace with real API)
      const currentPrice = prediction.initial_price * (1 + (Math.random() - 0.5) * 0.1)
      const priceChange = ((currentPrice - prediction.initial_price) / prediction.initial_price) * 100
      const direction = priceChange > 0 ? 'up' : 'down'
      
      // Send email notification
      await resend.emails.send({
        from: 'Stock Predictions <onboarding@resend.dev>',
        to: prediction.users.email,
        subject: `Your Stock Prediction for ${prediction.ticker} Update`,
        html: `
          <h1>Stock Movement Update</h1>
          <p>Your predicted stock ${prediction.ticker} has gone ${direction}!</p>
          <p>Initial price: $${prediction.initial_price}</p>
          <p>Current price: $${currentPrice.toFixed(2)}</p>
          <p>Change: ${priceChange.toFixed(2)}%</p>
        `
      })

      // Mark as notified
      await supabase
        .from('stock_predictions')
        .update({ notified: true })
        .eq('id', prediction.id)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
