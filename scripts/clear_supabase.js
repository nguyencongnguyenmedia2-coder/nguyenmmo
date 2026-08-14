const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pneetlrdafgdsfnwgmwu.supabase.co';
const supabaseKey = 'sb_publishable_dbcdV8Ertb7EfofOaCJ8Dg_grWw-3HQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearAllUsersAndOrders() {
  console.log('Clearing users and orders data from Supabase tables...');

  try {
    const { error: err1 } = await supabase.from('service_requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Cleared service_requests:', err1 ? err1.message : 'OK');
  } catch (e) {}

  try {
    const { error: err2 } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Cleared orders:', err2 ? err2.message : 'OK');
  } catch (e) {}

  try {
    const { error: err3 } = await supabase.from('wallet_transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Cleared wallet_transactions:', err3 ? err3.message : 'OK');
  } catch (e) {}

  try {
    const { error: err4 } = await supabase.from('wallets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Cleared wallets:', err4 ? err4.message : 'OK');
  } catch (e) {}

  try {
    const { error: err5 } = await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Cleared profiles:', err5 ? err5.message : 'OK');
  } catch (e) {}

  console.log('Supabase users and orders cleanup finished successfully!');
}

clearAllUsersAndOrders();

