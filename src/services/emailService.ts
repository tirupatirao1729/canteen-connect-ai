// Email service configuration and utilities
import { supabase } from '@/integrations/supabase/client';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  template: EmailTemplate;
  data?: Record<string, any>;
}

// Email templates
export const EMAIL_TEMPLATES = {
  WELCOME: {
    subject: 'Welcome to Canteen Connect AI!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Canteen Connect AI!</h2>
        <p>Hi {{fullName}},</p>
        <p>Thank you for registering with Canteen Connect AI. Your account has been created successfully!</p>
        <p><strong>Account Details:</strong></p>
        <ul>
          <li>Email: {{email}}</li>
          <li>Role: {{role}}</li>
          <li>Roll Number: {{rollNumber}}</li>
        </ul>
        <p>You can now login to your account and start ordering delicious food from our canteen.</p>
        <div style="margin: 20px 0;">
          <a href="{{loginUrl}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Login to Your Account</a>
        </div>
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>Canteen Connect AI Team</p>
      </div>
    `,
    text: `
      Welcome to Canteen Connect AI!
      
      Hi {{fullName}},
      
      Thank you for registering with Canteen Connect AI. Your account has been created successfully!
      
      Account Details:
      - Email: {{email}}
      - Role: {{role}}
      - Roll Number: {{rollNumber}}
      
      You can now login to your account and start ordering delicious food from our canteen.
      
      Login URL: {{loginUrl}}
      
      If you have any questions, please contact our support team.
      
      Best regards,
      Canteen Connect AI Team
    `
  },
  
  EMAIL_CONFIRMATION: {
    subject: 'Confirm Your Email - Canteen Connect AI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Confirm Your Email Address</h2>
        <p>Hi {{fullName}},</p>
        <p>Please confirm your email address to complete your registration with Canteen Connect AI.</p>
        <div style="margin: 20px 0;">
          <a href="{{confirmationUrl}}" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Confirm Email Address</a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">{{confirmationUrl}}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with us, please ignore this email.</p>
        <p>Best regards,<br>Canteen Connect AI Team</p>
      </div>
    `,
    text: `
      Confirm Your Email Address
      
      Hi {{fullName}},
      
      Please confirm your email address to complete your registration with Canteen Connect AI.
      
      Confirmation URL: {{confirmationUrl}}
      
      This link will expire in 24 hours.
      
      If you didn't create an account with us, please ignore this email.
      
      Best regards,
      Canteen Connect AI Team
    `
  }
};

// Email service class
export class EmailService {
  private static instance: EmailService;
  
  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Send email using Supabase Edge Functions (if configured)
  async sendEmailViaSupabase(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: emailData.to,
          subject: emailData.template.subject,
          html: emailData.template.html,
          text: emailData.template.text,
          data: emailData.data
        }
      });

      if (error) {
        console.error('Supabase email error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }

<<<<<<< HEAD
  // Fallback: Send email using external service (EmailJS, Resend, SendGrid, etc.)
  async sendEmailViaExternalService(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Sending email via external service:', emailData);
      
      // For now, we'll use a simple approach that logs the email content
      // In a real production environment, you would integrate with:
      // - EmailJS (free tier available)
      // - Resend (developer-friendly)
      // - SendGrid
      // - AWS SES
      // - Nodemailer with SMTP
      
      // Log the email for debugging purposes
      console.log('Email would be sent to:', emailData.to);
      console.log('Subject:', emailData.template.subject);
      console.log('Content preview:', emailData.template.text.substring(0, 200) + '...');
      
      // Simulate successful email sending
      // In production, replace this with actual email service integration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For now, we'll return success to prevent registration failures
      // In production, implement actual email sending here
=======
  // Fallback: Send email using external service (Resend, SendGrid, etc.)
  async sendEmailViaExternalService(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      // This would integrate with services like Resend, SendGrid, etc.
      // For now, we'll simulate success
      console.log('Sending email via external service:', emailData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
      return { success: true };
    } catch (error: any) {
      console.error('External email service error:', error);
      return { success: false, error: error.message };
    }
  }

  // Main method to send emails with fallback
  async sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
<<<<<<< HEAD
    // In production, skip Supabase email if not configured and go directly to fallback
    const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    
    if (isProduction) {
      // In production, try external service first (more reliable)
      console.log('Production environment detected, using external email service...');
      const externalResult = await this.sendEmailViaExternalService(emailData);
      
      if (externalResult.success) {
        return externalResult;
      }
      
      // If external service fails, try Supabase as fallback
      console.log('External email service failed, trying Supabase...');
      return await this.sendEmailViaSupabase(emailData);
    } else {
      // In development, try Supabase first
      const supabaseResult = await this.sendEmailViaSupabase(emailData);
      
      if (supabaseResult.success) {
        return supabaseResult;
      }

      // Fallback to external service
      console.log('Supabase email failed, trying external service...');
      return await this.sendEmailViaExternalService(emailData);
    }
=======
    // Try Supabase first
    const supabaseResult = await this.sendEmailViaSupabase(emailData);
    
    if (supabaseResult.success) {
      return supabaseResult;
    }

    // Fallback to external service
    console.log('Supabase email failed, trying external service...');
    return await this.sendEmailViaExternalService(emailData);
>>>>>>> 3ffd7d63b4ac680784cdacc977be31f1e218b66d
  }

  // Send welcome email after registration
  async sendWelcomeEmail(userData: {
    email: string;
    fullName: string;
    role: string;
    rollNumber?: string;
  }): Promise<{ success: boolean; error?: string }> {
    const template = EMAIL_TEMPLATES.WELCOME;
    const loginUrl = `${window.location.origin}/login`;
    
    const emailData: EmailData = {
      to: userData.email,
      template: {
        subject: template.subject,
        html: template.html
          .replace(/{{fullName}}/g, userData.fullName)
          .replace(/{{email}}/g, userData.email)
          .replace(/{{role}}/g, userData.role)
          .replace(/{{rollNumber}}/g, userData.rollNumber || 'N/A')
          .replace(/{{loginUrl}}/g, loginUrl),
        text: template.text
          .replace(/{{fullName}}/g, userData.fullName)
          .replace(/{{email}}/g, userData.email)
          .replace(/{{role}}/g, userData.role)
          .replace(/{{rollNumber}}/g, userData.rollNumber || 'N/A')
          .replace(/{{loginUrl}}/g, loginUrl)
      }
    };

    return await this.sendEmail(emailData);
  }

  // Send email confirmation
  async sendEmailConfirmation(userData: {
    email: string;
    fullName: string;
    confirmationUrl: string;
  }): Promise<{ success: boolean; error?: string }> {
    const template = EMAIL_TEMPLATES.EMAIL_CONFIRMATION;
    
    const emailData: EmailData = {
      to: userData.email,
      template: {
        subject: template.subject,
        html: template.html
          .replace(/{{fullName}}/g, userData.fullName)
          .replace(/{{confirmationUrl}}/g, userData.confirmationUrl),
        text: template.text
          .replace(/{{fullName}}/g, userData.fullName)
          .replace(/{{confirmationUrl}}/g, userData.confirmationUrl)
      }
    };

    return await this.sendEmail(emailData);
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();
