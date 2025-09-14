import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type User = Tables<'profiles'>;

export interface UserWithAuth {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  roll_number: string | null;
  profile_photo_url: string | null;
  date_of_birth: string | null;
  year_of_study: number | null;
  branch: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
}

export const userService = {
  // Get all users (for admin)
  async getAllUsers(): Promise<{ success: boolean; users?: UserWithAuth[]; error?: string }> {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return { success: false, error: profilesError.message };
      }

      // Get auth users data
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Error fetching auth users:', authError);
        return { success: false, error: authError.message };
      }

      // Combine profile and auth data
      const usersWithAuth: UserWithAuth[] = profiles.map(profile => {
        const authUser = authUsers.users.find(user => user.id === profile.user_id);
        return {
          ...profile,
          email: authUser?.email || 'N/A',
          last_sign_in_at: authUser?.last_sign_in_at || null,
          email_confirmed_at: authUser?.email_confirmed_at || null
        };
      });

      return { success: true, users: usersWithAuth };
    } catch (error: any) {
      console.error('Error fetching users:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user by ID
  async getUserById(userId: string): Promise<{ success: boolean; user?: UserWithAuth; error?: string }> {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return { success: false, error: profileError.message };
      }

      // Get auth user data
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
      
      if (authError) {
        console.error('Error fetching auth user:', authError);
        return { success: false, error: authError.message };
      }

      const userWithAuth: UserWithAuth = {
        ...profile,
        email: authUser.user?.email || 'N/A',
        last_sign_in_at: authUser.user?.last_sign_in_at || null,
        email_confirmed_at: authUser.user?.email_confirmed_at || null
      };

      return { success: true, user: userWithAuth };
    } catch (error: any) {
      console.error('Error fetching user:', error);
      return { success: false, error: error.message };
    }
  },

  // Update user role
  async updateUserRole(userId: string, role: 'Student' | 'Teacher' | 'Admin'): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error updating user role:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete user
  async deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete from profiles table first (due to foreign key constraint)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        return { success: false, error: profileError.message };
      }

      // Delete from auth users
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        console.error('Error deleting auth user:', authError);
        return { success: false, error: authError.message };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user statistics
  async getUserStats(): Promise<{ success: boolean; stats?: any; error?: string }> {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('role, created_at');

      if (error) {
        console.error('Error fetching user stats:', error);
        return { success: false, error: error.message };
      }

      const stats = {
        total: profiles.length,
        students: profiles.filter(p => p.role === 'Student').length,
        teachers: profiles.filter(p => p.role === 'Teacher').length,
        admins: profiles.filter(p => p.role === 'Admin').length,
        newThisMonth: profiles.filter(p => {
          const createdDate = new Date(p.created_at);
          const now = new Date();
          return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
        }).length
      };

      return { success: true, stats };
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
      return { success: false, error: error.message };
    }
  }
};
