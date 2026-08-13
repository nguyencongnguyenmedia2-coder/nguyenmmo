import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pneetlrdafgdsfnwgmwu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_dbcdV8Ertb7EfofOaCJ8Dg_grWw-3HQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Test Supabase connection helper
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('services').select('count', { count: 'exact', head: true });
    if (error) {
      console.warn('Supabase connection test warning (table might be empty or unmigrated):', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase connection exception:', err?.message || err);
    return { success: false, error: err?.message || 'Connection failed' };
  }
}
