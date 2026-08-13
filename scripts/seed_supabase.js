const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pneetlrdafgdsfnwgmwu.supabase.co';
const supabaseKey = 'sb_publishable_dbcdV8Ertb7EfofOaCJ8Dg_grWw-3HQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  { slug: 'facebook', name: 'Facebook Services', icon: '🚀', description: 'Tăng Follow, Like, Comment, View Reel, Member Group Facebook' },
  { slug: 'tiktok', name: 'TikTok Services', icon: '🎵', description: 'Tăng Follow, Like, View, Share, Live Stream TikTok' },
  { slug: 'instagram', name: 'Instagram Services', icon: '📸', description: 'Tăng Follower, Like Post, View Reel Instagram' },
  { slug: 'youtube', name: 'YouTube Services', icon: '▶️', description: 'Tăng Subscribe, View 4000h, Like, Comment YouTube' },
  { slug: 'telegram', name: 'Telegram Services', icon: '✈️', description: 'Tăng Member Group/Channel, Reaction Telegram' },
  { slug: 'zalo', name: 'Zalo Services', icon: '💬', description: 'Tăng Member Group Zalo, Like, Share Zalo OA' },
  { slug: 'shopee', name: 'Shopee Services', icon: '🛒', description: 'Tăng Follow Shop, Like Sản phẩm, Review Shopee' },
  { slug: 'ai', name: 'AI Tools & Accounts', icon: '🤖', description: 'Tài khoản ChatGPT Plus, Claude 3.5 Sonnet, Midjourney v6' },
  { slug: 'mmo', name: 'Proxy & VPS MMO', icon: '⚙️', description: 'Proxy IPv4/v6 Việt Nam & US, VPS MMO Treo Tool' },
  { slug: 'digital', name: 'Sản phẩm Digital', icon: '📦', description: 'Tài khoản Premium Canva, Netflix, Spotify, Software' },
  { slug: 'services', name: 'Marketing Services', icon: '📈', description: 'Dịch vụ Marketing trọn gói, SEO Google, Content AI' },
  { slug: 'courses', name: 'Khóa học MMO', icon: '🎓', description: 'Khóa học MMO 2026, TikTok Shop Affiliate, Facebook Ads' },
];

async function seed() {
  console.log('Seeding Supabase categories...');
  const { data, error } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' }).select();
  if (error) {
    console.error('Error seeding categories:', error.message);
  } else {
    console.log(`Successfully seeded ${data.length} categories into Supabase PostgreSQL!`);
  }
}

seed();
