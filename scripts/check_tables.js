const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://pneetlrdafgdsfnwgmwu.supabase.co';
const supabaseKey = 'sb_publishable_dbcdV8Ertb7EfofOaCJ8Dg_grWw-3HQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllTables() {
  console.log('--- Checking Supabase Tables ---');
  const tables = ['services', 'orders', 'service_requests', 'profiles', 'wallets', 'wallet_transactions'];
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`❌ Table '${table}':`, error.message);
    } else {
      console.log(`✅ Table '${table}': OK, rows count:`, data.length);
    }
  }
}

checkAllTables();
