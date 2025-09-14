-- Enable password strength and leaked password protection for enhanced security
UPDATE auth.config 
SET password_min_length = 8;

-- Note: Leaked password protection needs to be enabled in Supabase dashboard
-- Go to Authentication > Settings > Password Protection in Supabase dashboard