
import { supabase } from '@/integrations/supabase/client';

// Simple test function to verify Supabase connection
export async function testSupabaseConnection() {
  try {
    // Corrigir a query para usar uma sintaxe válida
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful, found', count, 'profiles');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
}
