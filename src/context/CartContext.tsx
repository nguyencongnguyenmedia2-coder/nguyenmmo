'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Service } from '@/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (service: Service, targetLink: string, quantity: number, notes?: string) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  couponCode: string;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subTotal: number;
  finalTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedCart = localStorage.getItem('digital_mmo_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {}
  }, []);

  const saveCart = (items: CartItem[]) => {
    setCart(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('digital_mmo_cart', JSON.stringify(items));
    }
  };

  const addToCart = (service: Service, targetLink: string, quantity: number, notes?: string) => {
    let unitPrice = service.salePrice || service.price;
    let totalAmount = unitPrice * quantity;

    const newItem: CartItem = {
      service,
      targetLink,
      quantity,
      unitPrice,
      totalAmount,
      notes,
    };

    saveCart([...cart, newItem]);
  };

  const removeFromCart = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
    setCouponCode('');
    setDiscountAmount(0);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'DIGITALMMO50' || cleanCode === 'HOT50K') {
      setCouponCode(cleanCode);
      setDiscountAmount(50000);
      return { success: true, message: 'Áp dụng mã giảm giá 50.000đ thành công!' };
    } else if (cleanCode === 'VIPPRO10' || cleanCode === 'GIAM10') {
      const calcDiscount = Math.round(subTotal * 0.1);
      setCouponCode(cleanCode);
      setDiscountAmount(calcDiscount);
      return { success: true, message: `Áp dụng mã giảm 10% (-${calcDiscount.toLocaleString()}đ) thành công!` };
    } else {
      return { success: false, message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.' };
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountAmount(0);
  };

  const subTotal = cart.reduce((acc, item) => acc + item.totalAmount, 0);
  const finalTotal = Math.max(0, subTotal - discountAmount);
  const itemCount = cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        couponCode,
        discountAmount,
        applyCoupon,
        removeCoupon,
        subTotal,
        finalTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
