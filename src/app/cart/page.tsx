'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';
import { formatVND } from '@/lib/utils';
import { ShoppingCart, Trash2, ArrowRight, Tag, ShieldCheck, ArrowLeft, X } from 'lucide-react';

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    clearCart, 
    couponCode, 
    discountAmount, 
    applyCoupon, 
    removeCoupon, 
    subTotal, 
    finalTotal 
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponMsg({ success: res.success, text: res.message });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-neon-red" />
            <span>GIỎ HÀNG DỊCH VỤ</span>
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Kiểm tra thông tin các dịch vụ và mã giảm giá trước khi thanh toán.
          </p>
        </div>
        <Link href="/services" className="text-xs font-bold text-gray-400 hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Tiếp tục mua thêm
        </Link>
      </div>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: CART ITEMS LIST (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#0D0D14] border border-white/10 rounded-3xl overflow-hidden shadow-glass">
              <div className="p-4 bg-white/5 border-b border-white/10 text-xs font-bold text-gray-300 grid grid-cols-12 gap-4 uppercase tracking-wider">
                <div className="col-span-6">Sản phẩm / Dịch vụ</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-3 text-right">Thành tiền</div>
                <div className="col-span-1 text-center">Xóa</div>
              </div>

              <div className="divide-y divide-white/5">
                {cart.map((item, index) => (
                  <div key={index} className="p-5 grid grid-cols-12 gap-4 items-center hover:bg-white/5 transition-all text-xs">
                    {/* Info */}
                    <div className="col-span-6 space-y-1">
                      <div className="font-bold text-white text-sm hover:text-neon-red transition-colors">
                        {item.service.name}
                      </div>
                      <div className="text-gray-400 truncate max-w-xs font-mono">
                        Link: <span className="text-neon-red">{item.targetLink}</span>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Đơn giá: {formatVND(item.unitPrice)}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2 text-center font-bold font-mono text-gray-200">
                      {item.quantity.toLocaleString()}
                    </div>

                    {/* Total */}
                    <div className="col-span-3 text-right font-black text-neon-red font-mono text-sm">
                      {formatVND(item.totalAmount)}
                    </div>

                    {/* Delete */}
                    <div className="col-span-1 text-center">
                      <button
                        onClick={() => removeFromCart(index)}
                        className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-xl transition-all"
                        title="Xóa dịch vụ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center text-xs">
                <button
                  onClick={clearCart}
                  className="text-gray-400 hover:text-red-400 font-medium"
                >
                  Xóa tất cả trong giỏ
                </button>
                <div className="text-gray-400">
                  Tổng cộng {cart.length} dịch vụ chọn mua
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY & COUPON (4 cols matching spec 9) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border-beam-card p-6 shadow-2xl space-y-6">
              
              <h2 className="text-base font-black text-white border-b border-white/10 pb-3">
                TỔNG ĐƠN HÀNG
              </h2>

              {/* Coupon Form */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-300 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-neon-red" />
                  Mã giảm giá / Promo Coupon:
                </label>
                
                {couponCode ? (
                  <div className="p-3 bg-neon-red/10 border border-neon-red/40 rounded-2xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-neon-red">{couponCode}</div>
                      <div className="text-[11px] text-gray-300">Đã trừ: -{formatVND(discountAmount)}</div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="p-1 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="Nhập mã (VD: MMOVip)"
                      className="w-full px-3.5 py-2.5 bg-[#050508] border border-white/15 rounded-2xl text-xs text-white uppercase outline-none focus:border-neon-red font-mono"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl shrink-0 transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}

                {couponMsg && (
                  <p className={`text-[11px] font-semibold ${couponMsg.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Price Calculation details */}
              <div className="space-y-3 pt-3 border-t border-white/10 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span>Tạm tính ({cart.length} dịch vụ):</span>
                  <span className="font-mono text-white font-bold">{formatVND(subTotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Giảm giá voucher:</span>
                  <span className="font-mono text-neon-red font-bold">
                    {discountAmount > 0 ? `-${formatVND(discountAmount)}` : '0đ'}
                  </span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">TỔNG TỔNG CỘNG:</span>
                  <span className="text-2xl font-black text-neon-red font-mono">
                    {formatVND(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full py-4 bg-neon-red hover:bg-neon-red-hover text-white text-sm font-black rounded-2xl btn-beam-touch hover:scale-[1.02] transition-all flex items-center justify-center gap-2 block text-center overflow-hidden"
              >
                <span>TIẾN HÀNH THANH TOÁN →</span>
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Thanh toán an toàn • Xử lý tự động trong 5 phút
              </div>

            </div>
          </div>

        </div>
      ) : (
        <div className="py-20 text-center bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4">
          <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">Giỏ hàng của bạn đang trống</h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Hãy khám phá kho dịch vụ mạng xã hội, tài khoản AI và công cụ MMO để thêm sản phẩm vào giỏ hàng.
          </p>
          <Link
            href="/services"
            className="inline-block px-6 py-3 bg-neon-red text-white text-xs font-bold rounded-2xl shadow-neon-red hover:scale-105 transition-all"
          >
            Khám phá dịch vụ ngay
          </Link>
        </div>
      )}
    </div>
  );
}
