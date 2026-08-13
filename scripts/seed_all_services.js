const { createClient } = require('@supabase/supabase-js');
const { MOCK_SERVICES } = require('../src/data/mockServices.ts');

const supabaseUrl = 'https://pneetlrdafgdsfnwgmwu.supabase.co';
const supabaseKey = 'sb_publishable_dbcdV8Ertb7EfofOaCJ8Dg_grWw-3HQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAllServices() {
  console.log('Seeding all 190+ official services into Supabase...');

  // Convert array to database column names (snake_case)
  const rows = MOCK_SERVICES.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    category: s.category,
    sub_category: s.subCategory,
    description: s.description,
    price: s.price,
    sale_price: s.salePrice || null,
    vip_price: s.vipPrice || null,
    min_quantity: s.min,
    max_quantity: s.max,
    eta: s.eta,
    rating: s.rating,
    review_count: s.reviewCount,
    sold: s.sold,
    in_stock: s.inStock,
    warranty: s.warranty,
    icon: s.icon,
  }));

  try {
    const { data, error } = await supabase
      .from('services')
      .upsert(rows, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Error seeding Supabase services:', error.message);
    } else {
      console.log(`✅ Successfully seeded ${data.length} official services into Supabase Cloud Database!`);
    }
  } catch (err) {
    console.error('Seeding exception:', err);
  }
}

seedAllServices();
