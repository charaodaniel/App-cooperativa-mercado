import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, Market, User } from '../types';
import { mockProducts, mockOrders, mockMarkets, mockUsers } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextType {
  products: Product[];
  orders: Order[];
  markets: Market[];
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useLocalStorage<Product[]>('products', mockProducts);
  const [orders, setOrders] = useLocalStorage<Order[]>('orders', mockOrders);
  const [markets] = useLocalStorage<Market[]>('markets', mockMarkets);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    const user = mockUsers.find(u => u.email === email);
    if (user && password === '123456') { // Mock password
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, updatedAt: new Date() }
        : order
    ));
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, ...updates }
        : product
    ));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  return (
    <AppContext.Provider value={{
      products,
      orders,
      markets,
      currentUser,
      login,
      logout,
      addOrder,
      updateOrderStatus,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};