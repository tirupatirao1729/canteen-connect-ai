// Supabase Edge Function for sending emails
// This file should be placed in: supabase/functions/send-email/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { to, subject, html, text, data } = await req.json()

    // For now, we'll use a simple email service
    // In production, you should integrate with services like:
    // - Resend (recommended)
    // - SendGrid
    // - Mailgun
    // - AWS SES

    // Example integration with Resend (uncomment and configure):
    /*
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured')
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Canteen Connect AI <noreply@yourdomain.com>',
        to: [to],
        subject: subject,
        html: html,
        text: text,
      }),
    })

    if (!emailResponse.ok) {
      const error = await emailResponse.text()
      throw new Error(`Email service error: ${error}`)
    }

    const result = await emailResponse.json()
    console.log('Email sent successfully:', result)
    */

    // For demo purposes, we'll simulate email sending
    console.log('Email would be sent to:', to)
    console.log('Subject:', subject)
    console.log('Data:', data)

    // In a real implementation, you would:
    // 1. Validate the email address
    // 2. Send the email via your chosen service
    // 3. Log the result
    // 4. Handle errors appropriately

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully (simulated)',
        // In production, you might want to return the email ID
        // emailId: result.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
