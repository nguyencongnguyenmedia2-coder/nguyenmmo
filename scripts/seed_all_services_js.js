const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://pneetlrdafgdsfnwgmwu.supabase.co';
const supabaseKey = 'sb_publishable_dbcdV8Ertb7EfofOaCJ8Dg_grWw-3HQ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function seedAll() {
  const tsContent = fs.readFileSync(path.join(__dirname, '../src/data/mockServices.ts'), 'utf8');
  
  // Extract json-like array by Regex or Eval safely
  const match = tsContent.match(/export const MOCK_SERVICES: Service\[\] = (\[[\s\S]*\]);/);
  if (!match) {
    console.error('Could not parse mockServices.ts');
    return;
  }

  // Evaluate TS text to JS array
  const rawArrayStr = match[1];
  let mockServices = [];
  try {
    mockServices = eval(rawArrayStr);
  } catch (e) {
    console.error('Eval error:', e);
    return;
  }

  console.log(`Parsed ${mockServices.length} services from mockServices.ts. Seeding to Supabase...`);

  const rows = mockServices.map((s) => ({
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

  const { data, error } = await supabase.from('services').upsert(rows, { onConflict: 'id' }).select();

  if (error) {
    console.error('Supabase Error:', error.message);
  } else {
    console.log(`🎉 SUCCESS! Seeded ${data.length} services directly into Supabase Cloud Database!`);
  }
}

seedAll();
