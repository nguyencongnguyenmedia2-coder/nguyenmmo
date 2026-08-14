const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const supabaseUrl = 'https://pneetlrdafgdsfnwgmwu.supabase.co';
const supabaseKey = 'sb_publishable_dbcdV8Ertb7EfofOaCJ8Dg_grWw-3HQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testProfilesUUID() {
  const profileRow = {
    id: crypto.randomUUID(),
    username: 'test_user_' + Date.now(),
    full_name: 'Nguyễn Văn A',
    email: `user_${Date.now()}@gmail.com`,
    phone: '0988 123 456',
    vip_tier: 'free',
  };

  const { data, error } = await supabase.from('profiles').insert([profileRow]).select();
  console.log('Profiles Insert Error:', error ? error.message : 'NONE');
  console.log('Profiles Insert Data:', data);

  if (data?.[0]?.id) {
    await supabase.from('profiles').delete().eq('id', data[0].id);
    console.log('Cleaned up profile row.');
  }
}

testProfilesUUID();
