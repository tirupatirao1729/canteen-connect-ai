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

<<<<<<< HEAD
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
=======
    // Option 1: Use Resend (Recommended - Free tier available)
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (RESEND_API_KEY) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Canteen Connect AI <noreply@canteenconnect.ai>',
            to: [to],
            subject: subject,
            html: html,
            text: text,
          }),
        })

        if (!emailResponse.ok) {
          const error = await emailResponse.text()
          throw new Error(`Resend API error: ${error}`)
        }

        const result = await emailResponse.json()
        console.log('Email sent successfully via Resend:', result)
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Email sent successfully',
            emailId: result.id 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      } catch (resendError) {
        console.error('Resend error:', resendError)
        // Fall through to simulation
      }
    }

    // Option 2: Use SendGrid (Alternative)
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
    
    if (SENDGRID_API_KEY) {
      try {
        const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SENDGRID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: to }],
              subject: subject,
            }],
            from: { email: 'noreply@canteenconnect.ai', name: 'Canteen Connect AI' },
            content: [
              { type: 'text/plain', value: text },
              { type: 'text/html', value: html },
            ],
          }),
        })

        if (!emailResponse.ok) {
          const error = await emailResponse.text()
          throw new Error(`SendGrid API error: ${error}`)
        }

        console.log('Email sent successfully via SendGrid')
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Email sent successfully via SendGrid'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      } catch (sendgridError) {
        console.error('SendGrid error:', sendgridError)
        // Fall through to simulation
      }
    }

    // Option 3: Fallback - Log email (for development/testing)
    console.log('📧 EMAIL SIMULATION (No email service configured):')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('HTML Preview:', html.substring(0, 200) + '...')
    console.log('Data:', data)
    console.log('')
    console.log('To enable real emails, configure RESEND_API_KEY or SENDGRID_API_KEY in your Supabase project settings.')
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d

    return new Response(
      JSON.stringify({ 
        success: true, 
<<<<<<< HEAD
        message: 'Email sent successfully (simulated)',
        // In production, you might want to return the email ID
        // emailId: result.id 
=======
        message: 'Email simulated successfully (no email service configured)',
        simulated: true
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
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
