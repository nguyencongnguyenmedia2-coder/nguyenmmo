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

const DEFAULT_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-101',
    transactionCode: 'TX928410',
    type: 'deposit',
    amount: 1000000,
    balanceBefore: 1500000,
    balanceAfter: 2500000,
    description: 'Nạp tiền chuyển khoản ngân hàng QR Techcombank',
    status: 'success',
    createdAt: '2026-08-12 14:30:00',
  },
  {
    id: 'tx-100',
    transactionCode: 'TX819201',
    type: 'purchase',
    amount: 450000,
    balanceBefore: 1950000,
    balanceAfter: 1500000,
    description: 'Thanh toán đơn hàng #DH102948',
    status: 'success',
    createdAt: '2026-08-11 09:15:00',
  },
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-102948',
    orderCode: 'DH102948',
    userId: 'usr-nguyen-102',
    customerName: 'Nguyễn Văn Tiến',
    email: 'nguyen.mmo2026@gmail.com',
    phone: '0988 123 456',
    serviceId: 'fb-follow-vn',
    serviceName: 'Facebook Follow Việt Nam (Nick Thật)',
    category: 'facebook',
    targetLink: 'https://facebook.com/nguyen.mmo.profile',
    quantity: 3000,
    totalAmount: 150000,
    discountAmount: 0,
    finalAmount: 150000,
    paymentMethod: 'wallet_balance',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    createdAt: '2026-08-13 10:20:00',
    updatedAt: '2026-08-13 10:20:00',
    startCount: 1250,
    remains: 1750,
    notes: 'Tăng đều tốc độ vừa phải',
  },
  {
    id: 'ord-102947',
    orderCode: 'DH102947',
    userId: 'usr-nguyen-102',
    customerName: 'Nguyễn Văn Tiến',
    email: 'nguyen.mmo2026@gmail.com',
    phone: '0988 123 456',
    serviceId: 'tt-follow-vn',
    serviceName: 'Tăng Follow TikTok Việt Nam',
    category: 'tiktok',
    targetLink: 'https://tiktok.com/@nguyen_mmo',
    quantity: 1000,
    totalAmount: 55000,
    discountAmount: 5000,
    finalAmount: 50000,
    paymentMethod: 'qr_code',
    paymentStatus: 'paid',
    orderStatus: 'completed',
    createdAt: '2026-08-12 16:45:00',
    updatedAt: '2026-08-12 17:15:00',
    startCount: 420,
    remains: 0,
  },
];

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
