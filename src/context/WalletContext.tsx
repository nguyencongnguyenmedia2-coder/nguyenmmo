'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, WalletTransaction } from '@/types';
import { useAuth } from './AuthContext';
import { generateTxCode } from '@/lib/utils';

interface WalletContextType {
  transactions: WalletTransaction[];
  orders: Order[];
  addTransaction: (type: 'deposit' | 'purchase' | 'refund' | 'bonus', amount: number, description: string) => void;
  addOrder: (newOrder: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => void;
}

const DEFAULT_TRANSACTIONS: WalletTransaction[] = [];
const DEFAULT_ORDERS: Order[] = [];

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUserBalance } = useAuth();
  const [transactions, setTransactions] = useState<WalletTransaction[]>(DEFAULT_TRANSACTIONS);
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedTx = localStorage.getItem('digital_mmo_transactions');
      if (savedTx) {
        const parsed = JSON.parse(savedTx);
        if (Array.isArray(parsed)) {
          setTransactions(parsed);
        }
      }
    } catch (e) {}

    try {
      const savedOrders = localStorage.getItem('digital_mmo_orders');
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
        }
      }
    } catch (e) {}
  }, []);

  const saveTx = (list: WalletTransaction[]) => {
    setTransactions(list);
    if (typeof window !== 'undefined') {
      localStorage.setItem('digital_mmo_transactions', JSON.stringify(list));
    }
  };

  const saveOrders = (list: Order[]) => {
    setOrders(list);
    if (typeof window !== 'undefined') {
      localStorage.setItem('digital_mmo_orders', JSON.stringify(list));
    }
  };

  const addTransaction = (type: 'deposit' | 'purchase' | 'refund' | 'bonus', amount: number, description: string) => {
    const currentBal = user ? user.balance : 0;
    let newBal = currentBal;
    if (type === 'deposit' || type === 'refund' || type === 'bonus') {
      newBal += amount;
    } else {
      newBal -= amount;
    }

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      transactionCode: generateTxCode(),
      type,
      amount,
      balanceBefore: currentBal,
      balanceAfter: newBal,
      description,
      status: 'success',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    updateUserBalance(newBal);
    saveTx([newTx, ...transactions]);
  };

  const addOrder = (newOrder: Order) => {
    saveOrders([newOrder, ...orders]);

    // Also auto-sync to Admin Service Requests (nguyenmmo_requests)
    try {
      const reqRecord = {
        id: newOrder.id,
        requestCode: newOrder.orderCode,
        guestName: newOrder.customerName || user?.name || 'Khách Hàng',
        guestPhone: newOrder.phone || user?.phone || '0988 123 456',
        guestEmail: newOrder.email || user?.email || '',
        serviceId: newOrder.serviceId,
        serviceNameSnapshot: newOrder.serviceName,
        categorySnapshot: (newOrder.category || 'SMM').toUpperCase(),
        serviceTypeSnapshot: 'Social Media',
        platform: (newOrder.category || 'SMM').toUpperCase(),
        targetUrl: newOrder.targetLink,
        quantity: newOrder.quantity,
        speed: '⚡ Nhanh',
        unitPrice: Math.round(newOrder.finalAmount / (newOrder.quantity || 1)),
        estimatedPrice: newOrder.finalAmount,
        customerNote: newOrder.notes || '',
        status: 'NEW',
        createdAt: newOrder.createdAt,
        updatedAt: newOrder.updatedAt,
      };

      const cached = localStorage.getItem('nguyenmmo_requests');
      const list = cached ? JSON.parse(cached) : [];
      list.unshift(reqRecord);
      localStorage.setItem('nguyenmmo_requests', JSON.stringify(list));

      // Asynchronously trigger Telegram / Supabase notification
      fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqRecord),
      }).catch(() => {});
    } catch (e) {}
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, orderStatus: status, updatedAt: new Date().toISOString() } : o));
    saveOrders(updated);
  };

  return (
    <WalletContext.Provider
      value={{
        transactions,
        orders,
        addTransaction,
        addOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};
