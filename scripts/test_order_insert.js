const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://pneetlrdafgdsfnwgmwu.supabase.co';
const supabaseKey = 'sb_publishable_dbcdV8Ertb7EfofOaCJ8Dg_grWw-3HQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testOrderInsert() {
  const row = {
    order_code: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
    customer_name: 'Test Customer',
    email: 'customer@gmail.com',
    phone: '0988123456',
    service_name: 'Facebook Follow',
    target_link: 'https://facebook.com/profile',
    quantity: 1000,
    total_amount: 50000,
    final_amount: 50000,
    payment_method: 'qr_code',
  };

  const { data, error } = await supabase.from('orders').insert([row]).select();
  console.log('Order Insert Error:', error);
  console.log('Order Insert Data:', data);
}

testOrderInsert();
