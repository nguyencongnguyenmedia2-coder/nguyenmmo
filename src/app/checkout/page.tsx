'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { formatVND, generateOrderCode } from '@/lib/utils';
import { 
  CreditCard, 
  QrCode, 
  Wallet, 
  ShieldCheck, 
  Copy, 
  Check, 
  Zap, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { PaymentMethod, Order } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, finalTotal, discountAmount, clearCart } = useCart();
  const { user, updateUserBalance } = useAuth();
  const { addOrder, addTransaction } = useWallet();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [username, setUsername] = useState(user?.username || '');
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet_balance');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const cartTotal = finalTotal > 0 ? finalTotal : 150000;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('1903888999901');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderCode = generateOrderCode();
    const serviceItem = cart[0] || {
      service: {
        id: 'fb-follow-vn',
        name: 'Facebook Follow Việt Nam (Nick Thật)',
        category: 'facebook',
      },
      targetLink: 'https://facebook.com/nguyen.mmo.profile',
      quantity: 3000,
    };

    if (paymentMethod === 'wallet_balance') {
      if (user && user.balance < cartTotal) {
        alert('Số dư tài khoản không đủ để thanh toán. Vui lòng nạp thêm tiền hoặc chọn phương thức Chuyển khoản QR!');
        setIsSubmitting(false);
        return;
      }
      addTransaction('purchase', cartTotal, `Thanh toán đơn hàng #${orderCode}`);
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderCode,
      userId: user?.id || 'usr-guest',
      customerName,
      email,
      phone,
      serviceId: serviceItem.service.id,
      serviceName: serviceItem.service.name,
      category: serviceItem.service.category as any,
      targetLink: serviceItem.targetLink,
      quantity: serviceItem.quantity,
      totalAmount: cartTotal + discountAmount,
      discountAmount,
      finalAmount: cartTotal,
      paymentMethod,
      paymentStatus: 'paid',
      orderStatus: 'processing', // Spec requirement 10: "🟢 Đang xử lý"
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      startCount: 100,
      remains: serviceItem.quantity,
      notes,
    };

    addOrder(newOrder);
    clearCart();

    setTimeout(() => {
      setIsSubmitting(false);
      router.push(`/order-success?code=${orderCode}`);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-4 border-b border-white/10">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-neon-red" />
          <span>THANH TOÁN ĐƠN HÀNG</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Điền thông tin và lựa chọn phương thức thanh toán tự động.
        </p>
      </div>

      <form onSubmit={handleCompletePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CUSTOMER INFO & PAYMENT METHOD (7 cols matching spec 10) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Customer Information */}
          <div className="p-6 bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4 shadow-glass">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="w-6 h-6 rounded-full bg-neon-red/20 text-neon-red flex items-center justify-center text-xs">1</span>
              <span>Thông tin khách hàng</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-neon-red"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Email nhận thông báo *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-neon-red"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Số điện thoại *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-neon-red"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold">Username tài khoản</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-neon-red font-mono"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-gray-300 font-semibold">Ghi chú đơn hàng (nếu có)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Yêu cầu riêng như: chạy từ từ, giãn cách thời gian..."
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white outline-none focus:border-neon-red"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Selector matching spec 10 */}
          <div className="p-6 bg-[#0D0D14] border border-white/10 rounded-3xl space-y-4 shadow-glass">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="w-6 h-6 rounded-full bg-neon-red/20 text-neon-red flex items-center justify-center text-xs">2</span>
              <span>Phương thức thanh toán</span>
            </h2>

            <div className="space-y-3 text-xs">
              
              {/* Option A: Wallet Balance */}
              <label
                onClick={() => setPaymentMethod('wallet_balance')}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'wallet_balance'
                    ? 'bg-neon-red/10 border-neon-red shadow-neon-red'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'wallet_balance'}
                    onChange={() => setPaymentMethod('wallet_balance')}
                    className="accent-neon-red"
                  />
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Số dư tài khoản (Trừ Ví)</div>
                    <div className="text-gray-400">Số dư hiện tại: <span className="text-emerald-400 font-bold font-mono">{formatVND(user?.balance || 2500000)}</span></div>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-full">Khuyên dùng</span>
              </label>

              {/* Option B: QR Code VietQR */}
              <label
                onClick={() => setPaymentMethod('qr_code')}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'qr_code'
                    ? 'bg-neon-red/10 border-neon-red shadow-neon-red'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'qr_code'}
                    onChange={() => setPaymentMethod('qr_code')}
                    className="accent-neon-red"
                  />
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Quét mã QR Code Ngân hàng (VietQR Tự Động)</div>
                    <div className="text-gray-400">Hỗ trợ tất cả ứng dụng App Ngân hàng Việt Nam</div>
                  </div>
                </div>
                <span className="text-[10px] bg-sky-500/20 text-sky-400 font-bold px-2.5 py-1 rounded-full">⚡ Auto 5s</span>
              </label>

              {/* Option C: Bank Transfer Direct */}
              <label
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'bg-neon-red/10 border-neon-red shadow-neon-red'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="accent-neon-red"
                  />
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Chuyển khoản Ngân hàng (Techcombank / MB)</div>
                    <div className="text-gray-400">Nhập thủ công số tài khoản và nội dung</div>
                  </div>
                </div>
              </label>

              {/* Option D: E-Wallet */}
              <label
                onClick={() => setPaymentMethod('e_wallet')}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                  paymentMethod === 'e_wallet'
                    ? 'bg-neon-red/10 border-neon-red shadow-neon-red'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'e_wallet'}
                    onChange={() => setPaymentMethod('e_wallet')}
                    className="accent-neon-red"
                  />
                  <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Ví điện tử MoMo / ZaloPay</div>
                    <div className="text-gray-400">Quét mã thanh toán ví điện tử</div>
                  </div>
                </div>
              </label>

            </div>

            {/* Dynamic QR Payment Display when QR Code is selected */}
            {paymentMethod === 'qr_code' && (
              <div className="p-4 bg-[#050508] border border-sky-500/30 rounded-2xl space-y-4 text-xs">
                <div className="text-center space-y-2">
                  <div className="font-bold text-sky-400">Mã QR Thanh Toán Tự Động VietQR</div>
                  <div className="inline-block p-3 bg-white rounded-2xl shadow-lg">
                    {/* Simulated VietQR image */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=STK:1903888999901-TECHCOMBANK-TOTAL:${cartTotal}`}
                      alt="VietQR Payment Code"
                      className="w-44 h-44 mx-auto"
                    />
                  </div>
                  <p className="text-gray-400 text-[11px]">Dùng app ngân hàng bất kỳ quét mã QR để chuyển chính xác số tiền.</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Ngân hàng:</span>
                    <span className="font-bold text-white">Techcombank (TCB)</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Chủ tài khoản:</span>
                    <span className="font-bold text-white uppercase">CÔNG TY DIGITAL MMO</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300">
                    <span>Số tài khoản:</span>
                    <div className="flex items-center gap-2 font-mono font-bold text-sky-400">
                      <span>1903 888 999 901</span>
                      <button
                        type="button"
                        onClick={handleCopyAccount}
                        className="p-1 hover:bg-white/10 rounded"
                        title="Copy số tài khoản"
                      >
                        {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY & SUBMIT BUTTON (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="p-6 bg-[#0E0E17] border border-white/15 rounded-3xl shadow-2xl space-y-6">
            
            <h2 className="text-base font-black text-white border-b border-white/10 pb-3 flex items-center justify-between">
              <span>ĐƠN HÀNG XÁC NHẬN</span>
              <span className="text-xs text-neon-red font-mono">1 Dịch vụ</span>
            </h2>

            {/* Service details review */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-1">
                <div className="font-bold text-white">Facebook Follow Việt Nam (Nick Thật)</div>
                <div className="text-gray-400">Số lượng: <span className="text-white font-mono font-bold">3.000</span></div>
                <div className="text-gray-400 font-mono truncate">Link: https://facebook.com/nguyen.mmo.profile</div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex justify-between text-gray-400">
                  <span>Giá dịch vụ:</span>
                  <span className="font-mono text-white">{formatVND(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Phí xử lý tự động:</span>
                  <span className="font-mono text-emerald-400 font-bold">MIỄN PHÍ</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">TỔNG THANH TOÁN:</span>
                  <span className="text-2xl font-black text-neon-red font-mono">
                    {formatVND(cartTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-neon-red hover:bg-neon-red-hover text-white text-base font-black rounded-2xl shadow-neon-red hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>ĐANG XỬ LÝ THANH TOÁN...</span>
              ) : (
                <span>⚡ XÁC NHẬN THANH TOÁN NGAY</span>
              )}
            </button>

            <div className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Cam kết tự động kích hoạt đơn hàng trong 5 phút
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
