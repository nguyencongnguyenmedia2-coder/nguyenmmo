const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://pneetlrdafgdsfnwgmwu.supabase.co';
const supabaseKey = 'sb_publishable_dbcdV8Ertb7EfofOaCJ8Dg_grWw-3HQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.from('services').select('*').limit(1);
  console.log('Error:', error);
  console.log('Data:', data);
}

checkSchema();
