export type CategorySlug = 
  | 'facebook' 
  | 'tiktok' 
  | 'instagram' 
  | 'youtube' 
  | 'telegram' 
  | 'zalo' 
  | 'shopee' 
  | 'x-twitter'
  | 'ai' 
  | 'mmo'
  | 'digital'
  | 'marketing'
  | 'courses';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  icon: string;
  description: string;
  count: number;
  badge?: string;
  isHot?: boolean;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: CategorySlug;
  subCategory: string;
  description: string;
  price: number; // In VND per 1000 or per item
  salePrice?: number;
  vipPrice?: number;
  min: number;
  max: number;
  eta: string;
  rating: number;
  reviewCount: number;
  sold: number;
  inStock: boolean;
  warranty: string;
  providerId?: string;
  providerServiceId?: string;
  features?: string[];
  terms?: string;
  faq?: ServiceFAQ[];
  icon?: string;
}

export interface CartItem {
  service: Service;
  targetLink: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  notes?: string;
}

export type PaymentMethod = 'bank_transfer' | 'e_wallet' | 'qr_code' | 'wallet_balance';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'canceled' | 'partial';

export interface Order {
  id: string;
  orderCode: string; // e.g. DH102948
  userId: string;
  customerName: string;
  email: string;
  phone?: string;
  serviceId: string;
  serviceName: string;
  category: CategorySlug;
  targetLink: string;
  quantity: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'unpaid';
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  startCount?: number;
  remains?: number;
  apiOrderId?: string;
  notes?: string;
}

export type ServiceRequestStatus = 
  | 'NEW'
  | 'CONTACTING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'WAITING_CUSTOMER'
  | 'COMPLETED'
  | 'CANCELED'
  | 'REJECTED';

export interface ServiceRequest {
  id: string;
  requestCode: string; // REQ-82941
  userId?: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  telegramUsername?: string;
  facebookUsername?: string;
  serviceId: string;
  serviceNameSnapshot: string;
  categorySnapshot: string;
  serviceTypeSnapshot?: string;
  platform?: string;
  targetUrl: string;
  quantity: number;
  speed: string;
  unitPrice: number;
  estimatedPrice: number;
  customerNote?: string;
  serviceInputs?: Record<string, any>;
  status: ServiceRequestStatus;
  assignedAdmin?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export type VIPTier = 'free' | 'basic' | 'pro' | 'business';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  vipTier: VIPTier;
  totalOrders: number;
  processingOrders: number;
  completedOrders: number;
  avatar?: string;
  referralCode?: string;
  role?: 'admin' | 'client';
  isAdmin?: boolean;
}

export interface WalletTransaction {
  id: string;
  transactionCode: string;
  type: 'deposit' | 'purchase' | 'refund' | 'bonus';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  status: 'success' | 'pending' | 'failed';
  createdAt: string;
}

export interface VIPPlan {
  id: string;
  name: string;
  slug: VIPTier;
  priceMonthly: number;
  discountRate: number; // e.g. 0.10 for 10% off
  benefits: string[];
  isPopular?: boolean;
  badge?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  author: string;
  authorAvatar?: string;
  date: string;
  readTime: string;
  views: number;
  thumbnail: string;
  published?: boolean;
  featured?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: 'prompt' | 'template' | 'ebook' | 'preset' | 'plugin' | 'extension' | 'tool' | 'checklist';
  isVipOnly: boolean;
  description: string;
  previewContent?: string;
  previewImage?: string;
  downloadCount: number;
  fileSize: string;
  fileUrl: string;
  rating: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  serviceName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface SMMProvider {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  balance: number;
  currency: string;
  status: 'active' | 'inactive';
  servicesCount: number;
}
