const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pneetlrdafgdsfnwgmwu.supabase.co';
const supabaseKey = 'sb_publishable_dbcdV8Ertb7EfofOaCJ8Dg_grWw-3HQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearAll() {
  console.log('Clearing demo data from Supabase tables...');

  try {
    const { error: err1 } = await supabase.from('service_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Cleared service_requests:', err1 ? err1.message : 'OK');
  } catch (e) {}

  try {
    const { error: err2 } = await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Cleared services:', err2 ? err2.message : 'OK');
  } catch (e) {}

  try {
    const { error: err3 } = await supabase.from('blogs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Cleared blogs:', err3 ? err3.message : 'OK');
  } catch (e) {}

  try {
    const { error: err4 } = await supabase.from('resources').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Cleared resources:', err4 ? err4.message : 'OK');
  } catch (e) {}

  console.log('Supabase demo data cleanup finished!');
}

clearAll();
