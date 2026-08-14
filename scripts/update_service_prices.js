const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'mockServices.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Match every service object block or replace price, salePrice, vipPrice fields
// Let's use regex or object parsing.
// In TS file: price: <number>, salePrice: <number>, vipPrice: <number>

// Let's parse each service block
const updatedContent = content.replace(/{\s*id:\s*['"]([^'"]+)['"][\s\S]*?\n\s*}/g, (match) => {
  // Extract name, subCategory, description, etc.
  const nameMatch = match.match(/name:\s*['"]([^'"]+)['"]/);
  const name = nameMatch ? nameMatch[1] : '';

  const priceMatch = match.match(/price:\s*(\d+)/);
  const oldPrice = priceMatch ? parseInt(priceMatch[1], 10) : 0;

  const isVip = name.toLowerCase().includes('vip') || name.toLowerCase().includes('pro') || name.toLowerCase().includes('cao cấp');
  const isReal = name.toLowerCase().includes('thật') || name.toLowerCase().includes('việt') || name.toLowerCase().includes('doanh nghiệp');
  const isLarge = name.toLowerCase().includes('combo') || name.toLowerCase().includes('gói') || name.toLowerCase().includes('vps') || name.toLowerCase().includes('năm');

  // Compute new base price (>= 250000)
  let basePrice = 280000;
  if (oldPrice > 0) {
    if (oldPrice < 50) {
      basePrice = 280000;
    } else if (oldPrice < 100) {
      basePrice = 320000;
    } else if (oldPrice < 200) {
      basePrice = 380000;
    } else if (oldPrice < 500) {
      basePrice = 450000;
    } else if (oldPrice < 1000) {
      basePrice = 580000;
    } else if (oldPrice < 5000) {
      basePrice = 750000;
    } else if (oldPrice < 50000) {
      basePrice = 980000;
    } else if (oldPrice < 250000) {
      basePrice = Math.max(290000, oldPrice * 10);
    } else {
      basePrice = Math.max(290000, oldPrice);
    }
  }

  if (isVip) basePrice = Math.round(basePrice * 1.35);
  if (isReal) basePrice = Math.round(basePrice * 1.2);
  if (isLarge) basePrice = Math.round(basePrice * 1.5);

  // Round to thousands
  basePrice = Math.max(280000, Math.round(basePrice / 10000) * 10000);

  const salePrice = Math.max(250000, Math.round((basePrice * 0.85) / 10000) * 10000);
  const vipPrice = Math.max(250000, Math.round((basePrice * 0.75) / 10000) * 10000);

  // Replace price, salePrice, vipPrice in the match block
  let newMatch = match.replace(/price:\s*\d+/, `price: ${basePrice}`);
  
  if (newMatch.includes('salePrice:')) {
    newMatch = newMatch.replace(/salePrice:\s*\d+/, `salePrice: ${salePrice}`);
  }
  
  if (newMatch.includes('vipPrice:')) {
    newMatch = newMatch.replace(/vipPrice:\s*\d+/, `vipPrice: ${vipPrice}`);
  }

  return newMatch;
});

fs.writeFileSync(filePath, updatedContent, 'utf-8');
console.log('Successfully updated all service prices in mockServices.ts to >= 250,000 VNĐ');
