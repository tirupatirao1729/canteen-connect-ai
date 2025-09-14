# Deploy Email Function to Supabase

## Option 1: Using Supabase Dashboard (Easiest)

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/twwqflvwhauekjvtimho
2. **Navigate to**: Edge Functions
3. **Create New Function**:
   - Name: `send-email`
   - Copy the code from `supabase/functions/send-email/index.ts`
   - Paste it into the editor
4. **Deploy**: Click "Deploy"

## Option 2: Using CLI (if working)

```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref twwqflvwhauekjvtimho

# Deploy the function
supabase functions deploy send-email
```

## Option 3: Manual Upload

1. **Zip the function folder**:
   - Create a zip file containing `supabase/functions/send-email/index.ts`
2. **Upload via Dashboard**:
   - Go to Edge Functions
   - Click "Upload"
   - Select your zip file

## Test the Function

After deployment, test with:

```bash
curl -X POST 'https://twwqflvwhauekjvtimho.supabase.co/functions/v1/send-email' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3d3FmbHZ3aGF1ZWtqdnRpbWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5OTQxMzcsImV4cCI6MjA3MjU3MDEzN30.udgL0Y_5pRggBjAu6st8x-xguyACQvcnYTOvcCKLUvQ' \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "html": "<h1>Test Email</h1><p>This is a test email from Canteen Connect AI!</p>",
    "text": "Test Email\n\nThis is a test email from Canteen Connect AI!"
  }'
```

## Expected Response

If successful, you should see:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "emailId": "re_xxxxxxxxx"
}
```

If no API key configured:
```json
{
  "success": true,
  "message": "Email simulated successfully (no email service configured)",
  "simulated": true
}
```
