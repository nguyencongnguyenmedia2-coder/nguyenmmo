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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedUser = localStorage.getItem('digital_mmo_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && typeof parsed === 'object') {
          setUser(parsed);
        }
      }
    } catch (e) {
      setUser(null);
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
          fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser),
          }).catch(() => {});
        } catch (e) {}
      } else {
        localStorage.removeItem('digital_mmo_user');
      }
    }
  };

  const login = (email?: string, name?: string) => {
    const userEmail = email || 'user@nguyenmmo.com';
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
    saveUserToStateAndStorage(loggedInUser);
  };

  const register = (name: string, email: string, phone: string) => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      username: email.split('@')[0] || 'user',
      name: name || 'Thành viên mới',
      email: email,
      phone: phone || '',
      balance: 0,
      vipTier: 'free',
      totalOrders: 0,
      processingOrders: 0,
      completedOrders: 0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      referralCode: `MMO${Math.floor(100 + Math.random() * 900)}`,
      role: 'client',
      isAdmin: false,
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
