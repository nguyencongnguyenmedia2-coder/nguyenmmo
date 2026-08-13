'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Zap, ChevronRight, Star } from 'lucide-react';
import { MOCK_SERVICES } from '@/data/mockServices';
import { formatVND } from '@/lib/utils';
import { Service } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Service[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = MOCK_SERVICES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.subCategory.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
    setResults(filtered.slice(0, 8));
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md transition-all">
      <div className="w-full max-w-2xl bg-[#0D0D14] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="relative flex items-center p-4 border-b border-white/10 bg-[#12121B]">
          <Search className="w-6 h-6 text-neon-red ml-2 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm dịch vụ Facebook, TikTok, Instagram, AI Tools, Proxy..."
            className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-base font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white mr-2"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl text-xs font-semibold"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {query.trim() === '' ? (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gợi ý tìm kiếm HOT:</div>
              <div className="flex flex-wrap gap-2">
                {['Facebook Follow', 'TikTok Follow', 'YouTube Subscribe', 'ChatGPT Plus', 'Claude Pro', 'Proxy IPv4'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    aria-label={`Search for ${tag}`}
                    className="px-3 py-1.5 bg-white/5 hover:bg-neon-red/20 hover:text-neon-red border border-white/10 rounded-xl text-xs font-medium text-gray-300 transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 text-neon-red" />
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Tìm thấy {results.length} dịch vụ:
              </div>
              {results.map((service) => (
                <Link
                  key={service.id}
                  href={`/service/${service.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-neon-red/10 border border-white/5 hover:border-neon-red/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neon-red/20 border border-neon-red/30 flex items-center justify-center text-lg">
                      {service.icon || '🚀'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-neon-red transition-colors flex items-center gap-2">
                        {service.name}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 uppercase font-mono">
                          {service.category}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-3 mt-0.5">
                        <span className="flex items-center text-gold-400">
                          <Star className="w-3 h-3 fill-gold-400 mr-1" />
                          {service.rating}
                        </span>
                        <span>Đã bán: {service.sold.toLocaleString()}</span>
                        <span>{service.eta}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-neon-red">
                      {formatVND(service.salePrice || service.price)}
                    </div>
                    <div className="text-[11px] text-gold-400">
                      VIP: {formatVND(service.vipPrice || service.price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400">
              <p className="text-base font-semibold text-gray-300">Không tìm thấy kết quả phù hợp cho "{query}"</p>
              <p className="text-xs mt-1 text-gray-500">Vui lòng thử từ khóa khác như "Facebook", "TikTok", "AI", "Proxy"...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
