import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WalletProvider } from '@/context/WalletContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatWidget } from '@/components/layout/ChatWidget';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nguyenmmo.vercel.app'),
  title: {
    default: 'Nguyên MMO - Kho Dịch Vụ Mạng Xã Hội, Công Cụ AI & Digital Marketplace',
    template: '%s | Nguyên MMO',
  },
  description: 'Nền tảng thương mại điện tử Nguyên MMO chuyên cung cấp dịch vụ Facebook, TikTok, Instagram, YouTube, Telegram, Zalo, tài khoản AI ChatGPT Plus, Claude 3.5, Midjourney, Proxy IPv4 & VPS MMO uy tín hàng đầu.',
  keywords: [
    'Nguyên MMO',
    'dịch vụ mmo',
    'dịch vụ mạng xã hội',
    'tăng follow facebook',
    'tăng follow tiktok',
    'tăng subscribe youtube',
    'tăng member telegram',
    'tài khoản chatgpt plus',
    'claude pro',
    'proxy ipv4',
    'vps mmo'
  ],
  authors: [{ name: 'Nguyên MMO', url: 'https://nguyenmmo.com' }],
  creator: 'Nguyên MMO',
  publisher: 'Nguyên MMO',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Nguyên MMO - Nền Tảng Dịch Vụ Digital & MMO Hàng Đầu Việt Nam',
    description: 'Xử lý tự động 24/7. Hơn 500+ dịch vụ mạng xã hội, công cụ AI & giải pháp Digital MMO thực chiến.',
    url: 'https://nguyenmmo.com',
    siteName: 'Nguyên MMO',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nguyên MMO - Dịch Vụ Mạng Xã Hội & Công Cụ AI',
    description: 'Kho dịch vụ mạng xã hội, tài khoản AI & giải pháp Digital MMO uy tín 24/7.',
  },
  verification: {
    google: ['google65e91d408d51fefb', 'google65e91d408d51fefb.html'],
  },
};

// JSON-LD Schema.org Structured Data for SEO
const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'Nguyên MMO',
  'alternateName': 'Nguyen MMO',
  'url': 'https://nguyenmmo.com',
  'description': 'Kho dịch vụ mạng xã hội, công cụ AI, phần mềm và giải pháp Digital MMO thực chiến.',
  'potentialAction': {
    '@type': 'SearchAction',
    'target': 'https://nguyenmmo.com/services?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

import { ToastProvider } from '@/context/ToastContext';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="bg-[#050507] text-gray-100 min-h-screen flex flex-col font-sans antialiased selection:bg-neon-red selection:text-white" suppressHydrationWarning>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WalletProvider>
                <Header />
                <main className="flex-grow pb-16 md:pb-0">{children}</main>
                <Footer />
                <ChatWidget />
                <MobileBottomNav />
              </WalletProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
