// Test Email Function
// Run this in browser console or Node.js to test email sending

const testEmailFunction = async () => {
  const SUPABASE_URL = 'https://twwqflvwhauekjvtimho.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3d3FmbHZ3aGF1ZWtqdnRpbWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTQxMzcsImV4cCI6MjA3MjU3MDEzN30.udgL0Y_5pRggBjAu6st8x-xguyACQvcnYTOvcCKLUvQ';

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'test@example.com', // Replace with your email
        subject: 'Test Email from Canteen Connect AI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Test Email</h2>
            <p>This is a test email from Canteen Connect AI!</p>
            <p>If you receive this email, the email service is working correctly.</p>
            <p>Best regards,<br>Canteen Connect AI Team</p>
          </div>
        `,
        text: `
          Test Email
          
          This is a test email from Canteen Connect AI!
          
          If you receive this email, the email service is working correctly.
          
          Best regards,
          Canteen Connect AI Team
        `
      })
    });

    const result = await response.json();
    console.log('Email function response:', result);
    
    if (result.success) {
      if (result.simulated) {
        console.log('⚠️ Email simulated - No API key configured');
        console.log('To enable real emails, add RESEND_API_KEY to Supabase environment variables');
      } else {
        console.log('✅ Email sent successfully!');
        console.log('Email ID:', result.emailId);
      }
    } else {
      console.error('❌ Email failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error testing email function:', error);
  }
};

// Run the test
testEmailFunction();
