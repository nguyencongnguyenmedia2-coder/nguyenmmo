'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  text: string;
}

interface ToastContextType {
  showToast: (text: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);

    // Trigger subtle haptic vibration on mobile devices if supported
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate?.([25]);
      } catch (e) {}
    }

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* TOAST CONTAINER POPUP: TOP-CENTER ON MOBILE, BOTTOM-RIGHT ON DESKTOP */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 sm:top-auto sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0 z-[9999] flex flex-col gap-2.5 w-[92vw] sm:w-auto sm:max-w-md pointer-events-none transition-all">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 sm:p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white transition-all animate-in slide-in-from-top-4 sm:slide-in-from-right-8 fade-in duration-300 ${
              toast.type === 'success'
                ? 'bg-[#0A1A12]/95 border-emerald-500/50 text-emerald-200 shadow-emerald-500/20'
                : toast.type === 'error'
                ? 'bg-[#1A0A0E]/95 border-neon-red/50 text-red-200 shadow-neon-red/20'
                : 'bg-[#0A121A]/95 border-sky-500/50 text-sky-200 shadow-sky-500/20'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-neon-red shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}

              <div className="leading-snug font-medium text-xs sm:text-sm">
                {toast.text}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 shrink-0 transition-colors active:scale-95"
              aria-label="Tắt thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
