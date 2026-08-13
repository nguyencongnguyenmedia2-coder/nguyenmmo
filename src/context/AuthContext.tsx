'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, VIPTier } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email?: string, name?: string) => void;
  register: (name: string, email: string, phone: string, password?: string) => boolean;
  logout: () => void;
  updateUserBalance: (newBalance: number) => void;
  updateVIPTier: (tier: VIPTier) => void;
  toggleFavorite: (serviceId: string) => void;
  favorites: string[];
}

const DEFAULT_DEMO_USER: User = {
  id: 'usr-nguyen-102',
  username: 'nguyen_mmo',
  name: 'Nguyễn Văn Tiến',
  email: 'nguyen.mmo2026@gmail.com',
  phone: '0988 123 456',
  balance: 2500000,
  vipTier: 'pro',
  totalOrders: 124,
  processingOrders: 7,
  completedOrders: 117,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  referralCode: 'MMO888',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_DEMO_USER);
  const [favorites, setFavorites] = useState<string[]>(['fb-follow-vn', 'tt-follow-vn', 'ai-chatgpt-plus']);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedUser = localStorage.getItem('digital_mmo_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === 'object') {
          setUser(parsed);
        }
      } else {
        localStorage.setItem('digital_mmo_user', JSON.stringify(DEFAULT_DEMO_USER));
      }
    } catch (e) {
      setUser(DEFAULT_DEMO_USER);
    }

    try {
      const savedFavs = localStorage.getItem('digital_mmo_favorites');
      if (savedFavs) {
        const parsed = JSON.parse(savedFavs);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (e) {}
  }, []);

  const saveUserToStateAndStorage = (updatedUser: User | null) => {
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      if (updatedUser) {
        localStorage.setItem('digital_mmo_user', JSON.stringify(updatedUser));
      } else {
        localStorage.removeItem('digital_mmo_user');
      }
    }
  };

  const login = (email?: string, name?: string) => {
    const loggedInUser: User = {
      ...DEFAULT_DEMO_USER,
      email: email || DEFAULT_DEMO_USER.email,
      name: name || (email?.split('@')[0] ? `Thành viên ${email.split('@')[0]}` : DEFAULT_DEMO_USER.name),
    };
    saveUserToStateAndStorage(loggedInUser);
  };

  const register = (name: string, email: string, phone: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      username: email.split('@')[0] || 'user',
      name: name || 'Thành viên mới',
      email: email,
      phone: phone || '',
      balance: 50000, // 50,000đ bonus for new users
      vipTier: 'free',
      totalOrders: 0,
      processingOrders: 0,
      completedOrders: 0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      referralCode: `MMO${Math.floor(100 + Math.random() * 900)}`,
    };
    saveUserToStateAndStorage(newUser);
    return true;
  };

  const logout = () => {
    saveUserToStateAndStorage(null);
  };

  const updateUserBalance = (newBalance: number) => {
    if (!user) return;
    const updated = { ...user, balance: newBalance };
    saveUserToStateAndStorage(updated);
  };

  const updateVIPTier = (tier: VIPTier) => {
    if (!user) return;
    const updated = { ...user, vipTier: tier };
    saveUserToStateAndStorage(updated);
  };

  const toggleFavorite = (serviceId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(serviceId);
      const updated = exists ? prev.filter((id) => id !== serviceId) : [...prev, serviceId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('digital_mmo_favorites', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        updateUserBalance,
        updateVIPTier,
        toggleFavorite,
        favorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
