import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// احصل على هذه المفاتيح من لوحة تحكم Supabase: https://app.supabase.com
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// وظائف مساعدة لإدارة بيانات المستخدمين
export const userService = {
  // إنشاء ملف مستخدم جديد
  async createUserProfile(userId, userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          name: userData.name,
          email: userData.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // جلب بيانات المستخدم
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // تحديث بيانات المستخدم
  async updateUserProfile(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // حذف ملف المستخدم
  async deleteUserProfile(userId) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;
    return true;
  }
};

