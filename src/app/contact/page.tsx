'use client';

import React, { useState } from 'react';
import { Headphones, Send, PhoneCall, Mail, MessageSquare, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-red/10 border border-neon-red/30 text-neon-red font-bold text-xs">
          <Headphones className="w-4 h-4" />
          <span>HỖ TRỢ KHÁCH HÀNG 24/7</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">TRUNG TÂM TRỢ GIÚP & TICKET</h1>
        <p className="text-gray-300 text-sm max-w-xl mx-auto">
          Đội ngũ kỹ thuật viên của <span className="text-neon-red font-bold">DIGITAL MMO</span> luôn sẵn sàng hỗ trợ giải đáp và xử lý sự cố trong vòng 2 phút.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info cards (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <a
            href="https://t.me/nguyenmmo07"
            target="_blank"
            rel="noreferrer"
            className="p-5 bg-[#0D0D14] border border-sky-500/30 hover:border-sky-500 rounded-3xl block transition-all shadow-glass group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <Send className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Telegram Support VIP</div>
                <div className="text-xs text-sky-400 font-mono">@nguyenmmo07</div>
              </div>
            </div>
          </a>

          <a
            href="https://zalo.me/0934811307"
            target="_blank"
            rel="noreferrer"
            className="p-5 bg-[#0D0D14] border border-blue-500/30 hover:border-blue-500 rounded-3xl block transition-all shadow-glass group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Zalo Hotline 24/7</div>
                <div className="text-xs text-blue-400 font-mono">0934811307</div>
              </div>
            </div>
          </a>

          <a
            href="https://www.facebook.com/nguyenads7"
            target="_blank"
            rel="noreferrer"
            className="p-5 bg-[#0D0D14] border border-indigo-500/30 hover:border-indigo-500 rounded-3xl block transition-all shadow-glass group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Facebook Admin</div>
                <div className="text-xs text-indigo-400 font-mono">fb.com/nguyenads7</div>
              </div>
            </div>
          </a>
        </div>

        {/* Support Ticket Form (7 cols) */}
        <div className="md:col-span-7 bg-[#0D0D14] border border-white/10 rounded-3xl p-6 shadow-glass space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <MessageSquare className="w-4 h-4 text-neon-red" />
            <span>Gửi Yêu Cầu Trợ Giúp (Support Ticket)</span>
          </h2>

          {sent ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-white">Ticket đã được gửi thành công!</h3>
              <p className="text-xs text-gray-300">Chuyên viên hỗ trợ sẽ phản hồi trực tiếp qua Email hoặc Telegram của bạn trong 5 phút.</p>
              <button onClick={() => setSent(false)} className="px-4 py-2 bg-neon-red text-white text-xs font-bold rounded-xl">Gửi ticket khác</button>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-300 font-bold">Vấn đề cần hỗ trợ *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="VD: Kiểm tra đơn hàng #DH102948 chạy chậm..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-2xl text-white outline-none focus:border-neon-red"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-bold">Nội dung chi tiết *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Mô tả chi tiết sự cố hoặc thắc mắc của bạn..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-2xl text-white outline-none focus:border-neon-red"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-neon-red hover:bg-neon-red-hover text-white text-xs font-bold rounded-2xl shadow-neon-red hover:scale-[1.02] transition-all"
              >
                GỬI YÊU CẦU TRỢ GIÚP NGAY
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
