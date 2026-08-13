'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Zap, User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Gift, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referral, setReferral] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên!');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Vui lòng nhập Email hợp lệ!');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Vui lòng nhập Số điện thoại!');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có tối thiểu 6 ký tự!');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không trùng khớp!');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Vui lòng đồng ý với Điều khoản dịch vụ!');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      register(name, email, phone, password);
      setIsLoading(false);
      router.push('/account');
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      
      {/* Outer Card with Laser Beam Glow */}
      <div className="border-beam-always p-8 space-y-6">
        
        {/* Header Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-neon-red/20 border border-neon-red/50 flex items-center justify-center text-neon-red mx-auto shadow-neon-red">
            <Zap className="w-7 h-7 fill-neon-red animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            TẠO TÀI KHOẢN MỚI
          </h1>
          <p className="text-xs text-gray-300">
            Tham gia cộng đồng <span className="text-neon-red font-bold">Nguyên MMO</span> ngay hôm nay
          </p>
        </div>

        {/* Welcome Bonus Offer Banner */}
        <div className="p-3 bg-gradient-to-r from-emerald-500/20 via-emerald-900/10 to-transparent border border-emerald-500/40 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5 animate-bounce" />
          </div>
          <div className="text-xs">
            <div className="font-extrabold text-emerald-300">🎁 Ưu đãi thành viên mới</div>
            <div className="text-gray-300 text-[11px]">Tự động tặng 50.000đ ưu đãi trải nghiệm khi đăng ký thành công.</div>
          </div>
        </div>

        {/* Validation Error Box */}
        {errorMsg && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          <div className="space-y-1">
            <label className="text-gray-200 font-bold block">Họ và tên của bạn: *</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Nguyễn Văn Tiến"
                className="w-full pl-10 pr-4 py-3 bg-[#05050A] border border-white/15 focus:border-neon-red rounded-2xl text-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-200 font-bold block">Địa chỉ Email: *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="nguyen.mmo2026@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-[#05050A] border border-white/15 focus:border-neon-red rounded-2xl text-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-200 font-bold block">Số điện thoại (Zalo): *</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="0988 123 456"
                className="w-full pl-10 pr-4 py-3 bg-[#05050A] border border-white/15 focus:border-neon-red rounded-2xl text-white outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-gray-200 font-bold block">Mật khẩu: *</label>
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
                  className="w-full pl-10 pr-9 py-3 bg-[#05050A] border border-white/15 focus:border-neon-red rounded-2xl text-white outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-200 font-bold block">Xác nhận mật khẩu: *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#05050A] border border-white/15 focus:border-neon-red rounded-2xl text-white outline-none transition-all font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-200 font-bold block">Mã giới thiệu (nếu có)</label>
            <input
              type="text"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
              placeholder="MMO888"
              className="w-full px-4 py-3 bg-[#05050A] border border-white/15 rounded-2xl text-white outline-none focus:border-neon-red font-mono uppercase"
            />
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2 text-gray-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-[#05050A] text-neon-red focus:ring-0 mt-0.5"
              />
              <span className="text-[11px] leading-snug">
                Tôi đồng ý với <Link href="/contact" className="text-neon-red hover:underline font-bold">Điều khoản sử dụng</Link> và <Link href="/contact" className="text-neon-red hover:underline font-bold">Chính sách bảo mật</Link> của Nguyên MMO.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-neon-red hover:bg-neon-red-hover text-white font-black rounded-2xl btn-beam-touch hover:scale-[1.02] transition-all text-sm flex items-center justify-center gap-2 overflow-hidden shadow-neon-red disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>Đang tạo tài khoản...</span>
            ) : (
              <>
                <span>⚡ TẠO TÀI KHOẢN VÀ ĐĂNG NHẬP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-300">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-neon-red font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </p>

      </div>
    </div>
  );
}
