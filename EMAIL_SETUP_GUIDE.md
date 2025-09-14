# 📧 Email Configuration Guide for Canteen Connect AI

## Current Issue
The email confirmation system is currently **simulating emails** instead of sending real emails. This means users won't receive actual email confirmations for registration.

## 🚀 Quick Solutions

### Option 1: Use Supabase Built-in Email (Easiest)

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to**: Authentication → Settings → Email Templates
3. **Enable Email Confirmations**: Turn on "Enable email confirmations"
4. **Configure SMTP** (if needed):
   - Go to Settings → Auth → SMTP Settings
   - Add your SMTP credentials

### Option 2: Use Resend (Recommended - Free)

1. **Sign up for Resend**: https://resend.com
2. **Get API Key**: Copy your API key from Resend dashboard
3. **Add to Supabase**:
   - Go to Supabase Dashboard → Settings → Edge Functions
   - Add environment variable: `RESEND_API_KEY=your_api_key_here`
4. **Deploy Edge Function**:
   ```bash
   supabase functions deploy send-email
   ```

### Option 3: Use SendGrid (Alternative)

1. **Sign up for SendGrid**: https://sendgrid.com
2. **Get API Key**: Create API key in SendGrid dashboard
3. **Add to Supabase**:
   - Go to Supabase Dashboard → Settings → Edge Functions
   - Add environment variable: `SENDGRID_API_KEY=your_api_key_here`
4. **Deploy Edge Function**:
   ```bash
   supabase functions deploy send-email
   ```

## 🔧 Manual Setup Steps

### Step 1: Configure Supabase Project

1. **Enable Email Confirmations**:
   ```sql
   -- In Supabase SQL Editor
   UPDATE auth.config 
   SET enable_email_confirmations = true;
   ```

2. **Set Email Templates**:
   - Go to Authentication → Settings → Email Templates
   - Customize confirmation email template

### Step 2: Deploy Email Function

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref twwqflvwhauekjvtimho

# Deploy the email function
supabase functions deploy send-email
```

### Step 3: Test Email Function

```bash
# Test the function locally
supabase functions serve send-email

# Test with curl
curl -X POST 'http://localhost:54321/functions/v1/send-email' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Test</h1>",
    "text": "Test"
  }'
```

## 🎯 Current Status

- ✅ **Email Templates**: Ready and configured
- ✅ **Edge Function**: Updated with Resend/SendGrid support
- ✅ **Registration Flow**: Properly handles email confirmation
- ❌ **Email Service**: Not configured (simulation mode)

## 🔍 Testing

### Test Registration Flow:
1. Try registering a new admin account
2. Check browser console for email simulation logs
3. Verify the confirmation flow works

### Test Email Service:
1. Configure Resend or SendGrid API key
2. Deploy the edge function
3. Try registration again
4. Check email inbox for confirmation

## 📝 Environment Variables Needed

Add these to your Supabase project settings:

```bash
# For Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx

# For SendGrid (alternative)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# Supabase (already configured)
SUPABASE_URL=https://twwqflvwhauekjvtimho.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚨 Troubleshooting

### Common Issues:

1. **"Email simulated successfully"**: No email service configured
   - **Solution**: Add RESEND_API_KEY or SENDGRID_API_KEY

2. **"Function not found"**: Edge function not deployed
   - **Solution**: Run `supabase functions deploy send-email`

3. **"Invalid API key"**: Wrong API key format
   - **Solution**: Check API key format and permissions

4. **"Email not received"**: Check spam folder
   - **Solution**: Add sender to whitelist

## 📞 Support

If you need help:
1. Check Supabase logs: Dashboard → Logs → Edge Functions
2. Check browser console for errors
3. Verify API key permissions
4. Test with a simple email first

---

**Next Steps**: Choose one of the options above and configure the email service to enable real email confirmations for admin registration.
