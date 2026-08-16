'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Zap, Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrorMsg('Vui lòng nhập Email đăng nhập!');
      return;
    }
    if (!password) {
      setErrorMsg('Vui lòng nhập Mật khẩu!');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    try {
      const cleanEmail = email.trim();
      const isAdmin = cleanEmail.toLowerCase().includes('admin') || cleanEmail.toLowerCase() === 'admin@nguyenmmo.com';

      if (isAdmin) {
        const fullAdminEmail = cleanEmail.includes('@') ? cleanEmail : 'admin@nguyenmmo.com';
        await login(fullAdminEmail, 'Admin Nguyễn (Quản trị)');
        setIsLoading(false);
        router.push('/admin');
      } else {
        await login(cleanEmail, cleanEmail.split('@')[0] || 'Khách hàng');
        setIsLoading(false);
        router.push('/account');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg('Đăng nhập thất bại, vui lòng thử lại!');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      
      {/* Outer Card with Laser Beam Glow */}
      <div className="border-beam-always p-8 space-y-6">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-neon-red/20 border border-neon-red/50 flex items-center justify-center text-neon-red mx-auto shadow-neon-red">
            <Zap className="w-7 h-7 fill-neon-red" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            ĐĂNG NHẬP TÀI KHOẢN
          </h1>
          <p className="text-xs text-gray-300">
            Truy cập hệ thống quản lý dịch vụ & kho tài nguyên <span className="text-neon-red font-bold">Nguyên MMO</span>
          </p>
        </div>

        {/* Error Notification Banner */}
        {errorMsg && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1.5">
            <label className="text-gray-200 font-bold block">Email / Tên đăng nhập *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="admin@nguyenmmo.com hoặc email của bạn..."
                className="w-full pl-10 pr-4 py-3 bg-[#05050A] border border-white/15 focus:border-neon-red rounded-2xl text-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-gray-200 font-bold block">Mật khẩu *</label>
              <Link href="/contact" className="text-neon-red hover:underline text-[11px] font-semibold">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-[#05050A] border border-white/15 focus:border-neon-red rounded-2xl text-white outline-none transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-gray-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-[#05050A] text-neon-red focus:ring-0"
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>

            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Bảo mật SSL
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-neon-red hover:bg-neon-red-hover text-white font-black rounded-2xl btn-beam-touch hover:scale-[1.02] transition-all text-sm flex items-center justify-center gap-2 overflow-hidden shadow-neon-red disabled:opacity-50"
          >
            {isLoading ? (
              <span>Đang xử lý đăng nhập...</span>
            ) : (
              <>
                <span>⚡ ĐĂNG NHẬP NGAY</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative py-1 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <span className="relative px-3 bg-[#0D0D14] text-[10px] text-gray-400 uppercase font-mono font-bold">Hoặc</span>
        </div>

        <button
          type="button"
          onClick={() => {
            login('nguyen.google@gmail.com', 'Nguyễn Google VIP');
            router.push('/account');
          }}
          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
            <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"/>
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16c1.8 3.7 5.6 6.3 10.1 6.3z"/>
          </svg>
          <span>Đăng nhập nhanh với Google</span>
        </button>

        <p className="text-center text-xs text-gray-300">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-neon-red font-bold hover:underline">
            Đăng ký tài khoản ngay
          </Link>
        </p>

      </div>
    </div>
  );
}
