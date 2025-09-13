# Supabase Email Configuration
# This file contains instructions for configuring email in your Supabase project

# 1. SUPABASE DASHBOARD CONFIGURATION
# Go to your Supabase project dashboard:
# https://supabase.com/dashboard/project/twwqflvwhauekjvtimho

# 2. AUTHENTICATION SETTINGS
# Navigate to: Authentication > Settings
# Configure the following:

# Email Templates:
# - Confirm signup: Enable and customize
# - Invite user: Enable if needed
# - Magic Link: Enable if needed
# - Change Email Address: Enable
# - Reset Password: Enable

# SMTP Settings (if you want to use your own email service):
# - SMTP Host: smtp.gmail.com (for Gmail)
# - SMTP Port: 587
# - SMTP User: your-email@gmail.com
# - SMTP Pass: your-app-password
# - SMTP Admin Email: your-email@gmail.com
# - SMTP Sender Name: Canteen Connect AI

# 3. EMAIL PROVIDER RECOMMENDATIONS
# For production, consider these email services:

# Option 1: Resend (Recommended)
# - Sign up at: https://resend.com
# - Get API key
# - Add to Supabase Edge Function environment variables
# - Cost: Free tier available, $20/month for 50k emails

# Option 2: SendGrid
# - Sign up at: https://sendgrid.com
# - Get API key
# - Add to Supabase Edge Function environment variables
# - Cost: Free tier available, $19.95/month for 40k emails

# Option 3: Mailgun
# - Sign up at: https://mailgun.com
# - Get API key
# - Add to Supabase Edge Function environment variables
# - Cost: Free tier available, $35/month for 50k emails

# 4. ENVIRONMENT VARIABLES FOR EDGE FUNCTIONS
# Add these to your Supabase project settings:
# - RESEND_API_KEY: your-resend-api-key
# - SENDGRID_API_KEY: your-sendgrid-api-key
# - MAILGUN_API_KEY: your-mailgun-api-key

# 5. DOMAIN CONFIGURATION
# For production, you should:
# - Set up a custom domain for emails
# - Configure SPF, DKIM, and DMARC records
# - Use a professional email address (e.g., noreply@yourdomain.com)

# 6. TESTING EMAIL FUNCTIONALITY
# To test the email functionality:
# 1. Deploy the Edge Function: supabase functions deploy send-email
# 2. Test registration with a real email address
# 3. Check email inbox (and spam folder)
# 4. Verify email confirmation works

# 7. MONITORING AND LOGS
# Monitor email delivery in:
# - Supabase Dashboard > Logs
# - Your email service provider dashboard
# - Set up alerts for failed deliveries

# 8. BACKUP EMAIL SOLUTION
# If Supabase email fails, the app will:
# - Show appropriate error messages
# - Allow users to continue (registration still works)
# - Log errors for debugging
# - Provide manual verification options
