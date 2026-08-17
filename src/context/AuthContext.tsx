'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, VIPTier } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email?: string, name?: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserBalance: (newBalance: number) => Promise<void>;
  updateVIPTier: (tier: VIPTier) => Promise<void>;
  toggleFavorite: (serviceId: string) => void;
  favorites: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const savedUser = localStorage.getItem('digital_mmo_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {}
    return null;
  });
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. First check server session /api/auth/session
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          const sUser: User = {
            id: data.user.id,
            username: data.user.username || data.user.email.split('@')[0],
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || '',
            balance: data.user.balance || 0,
            vipTier: (data.user.vipTier as VIPTier) || 'free',
            totalOrders: 0,
            processingOrders: 0,
            completedOrders: 0,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            referralCode: `MMO${Math.floor(100 + Math.random() * 900)}`,
            role: data.isAdmin ? 'admin' : 'client',
            isAdmin: data.isAdmin,
          };
          setUser(sUser);
          localStorage.setItem('digital_mmo_user', JSON.stringify(sUser));
        }
      })
      .catch(() => {});

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

  const saveUserToStateAndStorage = async (updatedUser: User | null) => {
    setUser(updatedUser);
    if (typeof window !== 'undefined') {
      if (updatedUser) {
        localStorage.setItem('digital_mmo_user', JSON.stringify(updatedUser));
        
        // AWAIT sync with server session cookie
        try {
          await fetch('/api/auth/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser),
          });
        } catch (e) {}

        // Save/update user to digital_mmo_users_list for local backup
        try {
          const rawList = localStorage.getItem('digital_mmo_users_list');
          let usersList: any[] = rawList ? JSON.parse(rawList) : [];
          if (!Array.isArray(usersList)) usersList = [];
          
          const index = usersList.findIndex((u) => u.id === updatedUser.id || u.email === updatedUser.email);
          if (index >= 0) {
            usersList[index] = { ...usersList[index], ...updatedUser };
          } else {
            usersList.push(updatedUser);
          }
          localStorage.setItem('digital_mmo_users_list', JSON.stringify(usersList));
        } catch (e) {}

        // Persist to Server API (/api/users)
        try {
          await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': updatedUser.id,
              'x-user-email': updatedUser.email,
            },
            body: JSON.stringify(updatedUser),
          });
        } catch (e) {}
      } else {
        localStorage.removeItem('digital_mmo_user');
        // Clear server session cookie
        try {
          await fetch('/api/auth/session', { method: 'DELETE' });
        } catch (e) {}
      }
    }
  };

  const login = async (email?: string, name?: string): Promise<boolean> => {
    const userEmail = (email || 'user@nguyenmmo.com').trim();
    const isAdminUser = userEmail.toLowerCase().includes('admin') || userEmail.toLowerCase() === 'admin@nguyenmmo.com';
    const userName = name || (userEmail.split('@')[0] ? `Thành viên ${userEmail.split('@')[0]}` : 'Khách hàng');

    const loggedInUser: User = {
      id: `usr-${Date.now()}`,
      username: userEmail.split('@')[0] || 'user',
      name: userName,
      email: userEmail,
      phone: '',
      balance: 0,
      vipTier: 'free',
      totalOrders: 0,
      processingOrders: 0,
      completedOrders: 0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      referralCode: `MMO${Math.floor(100 + Math.random() * 900)}`,
      role: isAdminUser ? 'admin' : 'client',
      isAdmin: isAdminUser,
    };
    await saveUserToStateAndStorage(loggedInUser);
    return true;
  };

  const register = async (name: string, email: string, phone: string): Promise<boolean> => {
    const userEmail = (email || '').trim();
    const isAdminUser = userEmail.toLowerCase().includes('admin') || userEmail.toLowerCase() === 'admin@nguyenmmo.com';
    const newUser: User = {
      id: `usr-${Date.now()}`,
      username: userEmail.split('@')[0] || 'user',
      name: name || 'Thành viên mới',
      email: userEmail,
      phone: phone || '',
      balance: 0,
      vipTier: 'free',
      totalOrders: 0,
      processingOrders: 0,
      completedOrders: 0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      referralCode: `MMO${Math.floor(100 + Math.random() * 900)}`,
      role: isAdminUser ? 'admin' : 'client',
      isAdmin: isAdminUser,
    };
    await saveUserToStateAndStorage(newUser);
    return true;
  };

  const logout = async (): Promise<void> => {
    await saveUserToStateAndStorage(null);
  };

  const updateUserBalance = async (newBalance: number): Promise<void> => {
    if (!user) return;
    const updated = { ...user, balance: newBalance };
    await saveUserToStateAndStorage(updated);
  };

  const updateVIPTier = async (tier: VIPTier): Promise<void> => {
    if (!user) return;
    const updated = { ...user, vipTier: tier };
    await saveUserToStateAndStorage(updated);
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
