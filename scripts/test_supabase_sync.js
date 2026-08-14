const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://pneetlrdafgdsfnwgmwu.supabase.co';
const supabaseKey = 'sb_publishable_dbcdV8Ertb7EfofOaCJ8Dg_grWw-3HQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log('Testing Supabase Cloud Sync...');

  // Test 1: Service Requests insert
  const reqRow = {
    request_code: `REQ-${Math.floor(10000 + Math.random() * 90000)}`,
    guest_name: 'Khách Hàng Test',
    guest_phone: '0988123456',
    guest_email: 'test@nguyenmmo.com',
    service_id: 'fb-follow',
    service_name_snapshot: 'Facebook Follow VIP',
    category_snapshot: 'FACEBOOK',
    quantity: 1000,
    unit_price: 50,
    estimated_price: 50000,
    status: 'NEW',
  };

  const { data: d1, error: e1 } = await supabase.from('service_requests').insert([reqRow]).select();
  console.log('Service Requests Insert Result:', e1 ? e1.message : 'OK Success!');

  // Test 2: Profiles insert
  const profileRow = {
    username: 'test_user_' + Date.now(),
    full_name: 'Nguyễn Văn A',
    email: `user_${Date.now()}@gmail.com`,
    phone: '0988 123 456',
    vip_tier: 'free',
  };

  const { data: d2, error: e2 } = await supabase.from('profiles').insert([profileRow]).select();
  console.log('Profiles Insert Result:', e2 ? e2.message : 'OK Success!');
}

testSupabase();
