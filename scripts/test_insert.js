const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://pneetlrdafgdsfnwgmwu.supabase.co';
const supabaseKey = 'sb_publishable_dbcdV8Ertb7EfofOaCJ8Dg_grWw-3HQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const row = {
    name: 'Test Service',
    slug: 'test-service-1',
    description: 'Test description',
    price: 50,
  };

  const { data, error } = await supabase.from('services').insert([row]).select();
  console.log('Insert Error:', error);
  console.log('Insert Data:', data);
}

testInsert();
