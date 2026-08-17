'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { 
  MessageCircle, 
  X, 
  Send, 
  PhoneCall, 
  Facebook, 
  Mail, 
  Sparkles, 
  Coffee, 
  Bot, 
  User, 
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';
import { CoffeeModal } from '@/components/ui/CoffeeModal';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const ChatWidget: React.FC = () => {
  const pathname = usePathname();

  // Hub & Modals toggle states
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isCoffeeModalOpen, setIsCoffeeModalOpen] = useState(false);

  // Tooltips
  const [showTooltip, setShowTooltip] = useState(true);

  // AI Chat States
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: '🤖 Xin chào! Tôi là **Trợ Lý AI NGUYÊN MMO**. Tôi có thể giúp bạn giải đáp dịch vụ Facebook, TikTok, AI Tools, Proxy, VPS và nạp tiền 24/7!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Scroll to bottom when AI chat opens or sends message
  useEffect(() => {
    if (isAiChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, isAiChatOpen]);

  // Hide in admin panel
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const quickPrompts = [
    '⚡ Cách mua VIA Facebook?',
    '🎵 Tăng Follow TikTok?',
    '🛡️ Chính sách bảo hành?',
    '💳 Nạp tiền VietQR tự động?',
    '🤖 Tài khoản ChatGPT Pro?',
  ];

  const handleSendAiMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: query,
          messages: aiMessages.map((m) => ({ role: m.sender === 'user' ? 'user' : 'model', content: m.text })),
        }),
      });

      const json = await res.json();
      const replyText = json.reply || 'Xin lỗi, có lỗi kết nối tới AI. Bạn vui lòng thử lại hoặc bấm nút chat Telegram/Zalo nhé!';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setAiMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: '⚠️ Không thể kết nối tới server AI. Vui lòng bấm "💬 Chat Kĩ Thuật Viên" bên dưới để được hỗ trợ 1-1 ngay nhé!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setAiMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Adjust bottom distance on pages with sticky bottom purchase bars
  const isServiceDetailPage = pathname?.startsWith('/service/');
  const isCheckoutPage = pathname?.startsWith('/checkout');
  const hasStickyBar = isServiceDetailPage || isCheckoutPage;

  const mobileBottomClass = hasStickyBar ? 'bottom-[120px]' : 'bottom-[72px]';

  return (
    <>
      {/* 🤖 1. AI CHATBOT WINDOW MODAL (Fitted for PC & Mobile) */}
      {isAiChatOpen && (
        <div className="fixed inset-x-2 bottom-16 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-[380px] h-[75vh] sm:h-[520px] max-h-[620px] bg-[#0C0C14]/98 backdrop-blur-2xl border border-purple-500/40 rounded-[28px] shadow-[0_20px_60px_rgba(150,50,255,0.3)] text-white flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          
          {/* AI Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-[#0C0C14] border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white shadow-md shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                  <span>Trợ Lý AI NGUYÊN MMO</span>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300 text-[9px] font-mono font-bold border border-purple-500/40">
                    GEMINI 2.0
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Tư vấn tự động 24/7
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsAiChatOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Messages Area */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 custom-scrollbar text-xs">
            {aiMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-neon-red text-white font-medium rounded-tr-none'
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                  <div className="text-[9px] text-gray-400 mt-1 text-right font-mono opacity-70">
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-neon-red/30 border border-neon-red/40 flex items-center justify-center text-neon-red shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-purple-300 text-xs font-mono p-2">
                <Bot className="w-4 h-4 animate-spin text-purple-400" />
                <span>Trợ lý AI đang suy nghĩ...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-white/5 border-t border-white/10 flex gap-1.5 overflow-x-auto custom-scrollbar whitespace-nowrap shrink-0">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendAiMessage(p)}
                className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold transition-all shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#0A0A10] border-t border-white/10 space-y-2 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendAiMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Hỏi AI về dịch vụ Facebook, TikTok, AI..."
                className="flex-1 px-3.5 py-2.5 bg-white/5 border border-white/15 focus:border-purple-500 rounded-xl text-xs text-white placeholder-gray-500 outline-none"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl disabled:opacity-40 transition-all shadow-md shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-gray-400 pt-0.5 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Google AI Gemini Powered
              </span>
              <a
                href="https://t.me/nguyenmmo07"
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 hover:underline flex items-center gap-0.5 font-bold"
              >
                <MessageCircle className="w-3 h-3" /> Chat Kĩ Thuật Viên
              </a>
            </div>
          </div>

        </div>
      )}

      {/* 💬 2. SUPPORT CHANNELS MODAL */}
      {isSupportOpen && (
        <div className="fixed inset-x-2 bottom-16 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-80 bg-[#0D0D14]/98 backdrop-blur-xl border border-white/15 rounded-3xl shadow-2xl p-4 sm:p-5 text-white animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-neon-red flex items-center justify-center font-bold text-white shadow-neon-red">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm">Hỗ Trợ Khách Hàng</div>
                <div className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Trực tuyến 24/7 (Phản hồi &lt; 2 phút)
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsSupportOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-3 space-y-2 text-xs">
            <a
              href="https://t.me/nguyenmmo07"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-bold transition-all group"
            >
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs">Telegram: @nguyenmmo07</span>
              </div>
              <span className="text-[9px] sm:text-[10px] bg-sky-500/20 px-2 py-0.5 rounded-full font-mono">⚡ Nhanh nhất</span>
            </a>

            <a
              href="https://zalo.me/0934811307"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold transition-all group"
            >
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs">Zalo: 0934811307</span>
              </div>
              <span className="text-[9px] sm:text-[10px] bg-blue-500/20 px-2 py-0.5 rounded-full font-mono">24/7</span>
            </a>

            <a
              href="https://www.facebook.com/nguyenads7"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold transition-all group"
            >
              <div className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs">FB: nguyenads7</span>
              </div>
              <span className="text-[9px] sm:text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded-full font-mono">Admin</span>
            </a>

            <a
              href="mailto:support@digitalmmo.com"
              className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium transition-all"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neon-red" />
                <span className="text-xs">Gửi Email Hỗ Trợ</span>
              </div>
            </a>
          </div>

          <div className="pt-1 text-center text-[10px] text-gray-400">
            Hỗ trợ tư vấn giải pháp MMO & bảo hành đơn hàng 24/7
          </div>
        </div>
      )}

      {/* 📱 3. MOBILE FLOATING ACTION HUB POPUP SHEET (WHEN TAPPED ON MOBILE) */}
      {isHubOpen && (
        <div className="sm:hidden fixed inset-x-3 bottom-[125px] z-50 bg-[#0D0D15]/98 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 shadow-2xl text-white space-y-3 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-neon-red fill-neon-red animate-pulse" />
              <span className="text-xs font-black text-white">NGUYÊN MMO ACTION HUB</span>
            </div>
            <button
              onClick={() => setIsHubOpen(false)}
              className="p-1 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {/* Tile 1: AI Chat */}
            <button
              onClick={() => {
                setIsHubOpen(false);
                setIsAiChatOpen(true);
                setIsSupportOpen(false);
              }}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-purple-900/40 border border-purple-500/40 text-white flex items-center justify-between active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-white flex items-center gap-1">
                    <span>Trợ Lý AI Gemini</span>
                    <span className="px-1.5 py-0.2 bg-purple-500/30 text-purple-300 text-[8px] font-mono rounded">24/7</span>
                  </div>
                  <div className="text-[10px] text-gray-400">Tư vấn tự động 100% về dịch vụ</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-purple-400" />
            </button>

            {/* Tile 2: Hỗ Trợ Trực Tiếp */}
            <button
              onClick={() => {
                setIsHubOpen(false);
                setIsSupportOpen(true);
                setIsAiChatOpen(false);
              }}
              className="w-full p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-between active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neon-red flex items-center justify-center text-white font-bold shrink-0 shadow-neon-red">
                  <MessageCircle className="w-4.5 h-4.5 fill-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-white">Hỗ Trợ Trực Tiếp (Zalo/Telegram)</div>
                  <div className="text-[10px] text-gray-400">Phản hồi &lt; 2 phút trực tuyến</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* Tile 3: Mời Ly Cafe */}
            <button
              onClick={() => {
                setIsHubOpen(false);
                setIsCoffeeModalOpen(true);
              }}
              className="w-full p-3 rounded-2xl bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-amber-500/20 border border-pink-500/30 text-white flex items-center justify-between active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center text-white font-bold shrink-0">
                  <Coffee className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-amber-300">☕ Mời NGUYENMMO Ly Cafe</div>
                  <div className="text-[10px] text-gray-400">Ủng hộ động lực cho tác giả ❤️</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}

      {/* 🚀 FLOATING CONTROLS: COMPACT ON MOBILE, 3 BUTTONS ON DESKTOP */}
      <div className={`fixed ${mobileBottomClass} md:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end gap-2.5 transition-all duration-300`}>
        
        {/* Floating Welcome Tooltip */}
        {showTooltip && !isSupportOpen && !isAiChatOpen && !isHubOpen && (
          <div className="mb-1 px-3 py-1.5 bg-[#0F0F18]/95 backdrop-blur-md border border-neon-red/40 rounded-2xl shadow-2xl text-[11px] sm:text-xs text-white flex items-center gap-2 animate-bounce max-w-[220px] sm:max-w-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Cần hỗ trợ hoặc tư vấn AI? ⚡</span>
            <button
              onClick={() => setShowTooltip(false)}
              className="ml-auto text-gray-400 hover:text-white p-0.5"
              title="Đóng thông báo"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* 📱 MOBILE VIEW (< sm): SINGLE COMPACT GLOWING FAB HUB BUTTON */}
        <div className="sm:hidden">
          <button
            onClick={() => {
              setIsHubOpen(!isHubOpen);
              setIsSupportOpen(false);
              setIsAiChatOpen(false);
              setShowTooltip(false);
            }}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-red via-purple-600 to-amber-500 text-white shadow-[0_6px_20px_rgba(255,23,68,0.5)] flex items-center justify-center active:scale-90 transition-all border border-white/30 relative"
            aria-label="NGUYÊN MMO Action Hub"
          >
            {isHubOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <>
                <Zap className="w-6 h-6 text-white fill-white animate-pulse" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#050507]"></span>
              </>
            )}
          </button>
        </div>

        {/* 💻 DESKTOP VIEW (>= sm): 3 CLEAN STACKED BUTTONS WITH ZERO OVERLAP */}
        <div className="hidden sm:flex flex-col items-end gap-2.5">
          {/* Button 1: Trợ Lý AI */}
          <button
            onClick={() => {
              setIsAiChatOpen(!isAiChatOpen);
              setIsSupportOpen(false);
              setShowTooltip(false);
            }}
            className="group relative px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-[0_8px_25px_rgba(150,50,255,0.4)] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-white/20"
            aria-label="Trợ Lý AI NGUYÊN MMO"
          >
            <Bot className="w-5 h-5 text-white animate-pulse shrink-0" />
            <span className="font-black tracking-wide">🤖 Trợ Lý AI</span>
          </button>

          {/* Button 2: Mời Ly Cafe */}
          <button
            onClick={() => setIsCoffeeModalOpen(true)}
            className="group relative px-4 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-[0_8px_25px_rgba(255,50,120,0.4)] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-white/30"
            aria-label="Mời NGUYENMMO Ly Cafe"
          >
            <Coffee className="w-4.5 h-4.5 text-white animate-bounce shrink-0" />
            <span className="font-black tracking-wide drop-shadow-sm">☕ Mời Ly Cafe</span>
          </button>

          {/* Button 3: Hỗ Trợ */}
          <button
            onClick={() => {
              setIsSupportOpen(!isSupportOpen);
              setIsAiChatOpen(false);
              setShowTooltip(false);
            }}
            className="group relative px-4 py-2.5 rounded-full bg-neon-red hover:bg-neon-red-hover text-white font-bold text-sm shadow-neon-red flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-white/20"
            aria-label="Hỗ trợ khách hàng"
          >
            <MessageCircle className="w-5 h-5 fill-white animate-pulse shrink-0" />
            <span className="font-black tracking-wide">💬 Hỗ trợ</span>
          </button>
        </div>

      </div>

      {/* Coffee Modal Poster Component */}
      <CoffeeModal
        isOpen={isCoffeeModalOpen}
        onClose={() => setIsCoffeeModalOpen(false)}
      />
    </>
  );
};
