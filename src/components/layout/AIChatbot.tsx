'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, X, Send, Sparkles, MessageCircle, RefreshCw, User, ShieldCheck, Zap } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIChatbot: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: '🤖 Xin chào! Tôi là **Trợ Lý AI NGUYÊN MMO**. Tôi có thể giúp bạn giải đáp dịch vụ Facebook, TikTok, AI Tools, Proxy, VPS và nạp tiền 24/7!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Hide on admin panel
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    '⚡ Cách mua VIA Facebook?',
    '🎵 Tăng Follow TikTok trong bao lâu?',
    '🛡️ Chính sách bảo hành thế nào?',
    '💳 Nạp tiền VietQR tự động?',
    '🤖 Tài khoản ChatGPT Pro?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: query,
          messages: messages.map((m) => ({ role: m.sender === 'user' ? 'user' : 'model', content: m.text })),
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

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: '⚠️ Không thể kết nối tới server AI. Vui lòng bấm "💬 Chat Kĩ Thuật Viên" bên dưới để được hỗ trợ 1-1 ngay nhé!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const isServiceDetailPage = pathname?.startsWith('/service/');
  const isCheckoutPage = pathname?.startsWith('/checkout');
  const hasStickyBar = isServiceDetailPage || isCheckoutPage;

  // Position above the standard chat widget
  const mobileBottomClass = hasStickyBar ? 'bottom-[180px]' : 'bottom-[125px]';

  return (
    <div className={`fixed ${mobileBottomClass} md:bottom-24 right-3 sm:right-6 z-40 flex flex-col items-end transition-all duration-300`}>
      
      {/* Floating Welcome Notification Bubble */}
      {showNotification && !isOpen && (
        <div className="mb-2 px-3.5 py-2 bg-gradient-to-r from-[#1A0B16] via-[#140D1E] to-[#0E0F1D] border border-purple-500/40 rounded-2xl shadow-2xl text-[11px] sm:text-xs text-white flex items-center gap-2 animate-bounce max-w-[250px] sm:max-w-xs">
          <Bot className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
          <span className="truncate">Hỏi Trợ Lý AI NGUYÊN MMO ngay! 🤖</span>
          <button
            onClick={() => setShowNotification(false)}
            className="ml-auto text-gray-400 hover:text-white p-0.5"
            title="Đóng thông báo"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating AI Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[320px] sm:w-[380px] h-[500px] bg-[#0C0C14]/95 backdrop-blur-2xl border border-purple-500/30 rounded-[28px] shadow-[0_20px_60px_rgba(150,50,255,0.2)] text-white flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-[#0C0C14] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-white shadow-md">
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
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar text-xs">
            
            {messages.map((msg) => (
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
                  className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line shadow-sm ${
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

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-purple-300 text-xs font-mono p-2">
                <Bot className="w-4 h-4 animate-spin text-purple-400" />
                <span>Trợ lý AI đang suy nghĩ...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-white/5 border-t border-white/10 flex gap-1.5 overflow-x-auto custom-scrollbar whitespace-nowrap">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold transition-all shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#0A0A10] border-t border-white/10 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
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
                className="text-sky-400 hover:underline flex items-center gap-0.5"
              >
                <MessageCircle className="w-3 h-3" /> Gặp Kĩ Thuật Viên
              </a>
            </div>
          </div>

        </div>
      )}

      {/* Main Floating Trigger Button for AI Chatbot */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowNotification(false);
        }}
        className="group relative p-3 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm shadow-[0_8px_25px_rgba(150,50,255,0.4)] flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-white/20"
        aria-label="Trợ Lý AI NGUYÊN MMO"
      >
        <Bot className="w-5 h-5 text-white animate-pulse shrink-0" />
        <span className="hidden sm:inline font-black tracking-wide">🤖 Trợ Lý AI</span>
        <span className="sm:hidden text-xs font-black pr-0.5">🤖 AI</span>
      </button>

    </div>
  );
};
