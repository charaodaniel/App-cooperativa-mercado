import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { Product, Order, Market, Quote, Document } from '../types';

interface AppContextType {
  products: Product[];
  orders: Order[];
  markets: Market[];
  quotes: Quote[];
  documents: Document[];
  loading: boolean;
  
  // Product operations
  addProduct: (product: Omit<Product, 'id' | 'companyId'>) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  
  // Order operations
  addOrder: (order: Omit<Order, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  
  // Market operations
  addMarket: (market: Omit<Market, 'id' | 'companyId'>) => Promise<void>;
  updateMarket: (marketId: string, updates: Partial<Market>) => Promise<void>;
  deleteMarket: (marketId: string) => Promise<void>;
  
  // Quote operations
  addQuote: (quote: Omit<Quote, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateQuote: (quoteId: string, updates: Partial<Quote>) => Promise<void>;
  deleteQuote: (quoteId: string) => Promise<void>;
  
  // Document operations
  uploadDocument: (file: File, metadata: Partial<Document>) => Promise<void>;
  deleteDocument: (documentId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, currentCompany } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time data when company changes
  useEffect(() => {
    if (!currentCompany?.id) {
      setProducts([]);
      setOrders([]);
      setMarkets([]);
      setQuotes([]);
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Subscribe to products
    const productsQuery = query(
      collection(db, 'products'),
      where('companyId', '==', currentCompany.id)
    );
    const unsubscribeProducts = onSnapshot(productsQuery, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productsData);
    });

    // Subscribe to orders
    const ordersQuery = query(
      collection(db, 'orders'),
      where('companyId', '==', currentCompany.id),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Order[];
      setOrders(ordersData);
    });

    // Subscribe to markets
    const marketsQuery = query(
      collection(db, 'markets'),
      where('companyId', '==', currentCompany.id)
    );
    const unsubscribeMarkets = onSnapshot(marketsQuery, (snapshot) => {
      const marketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Market[];
      setMarkets(marketsData);
    });

    // Subscribe to quotes
    const quotesQuery = query(
      collection(db, 'quotes'),
      where('companyId', '==', currentCompany.id),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeQuotes = onSnapshot(quotesQuery, (snapshot) => {
      const quotesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        validUntil: doc.data().validUntil?.toDate()
      })) as Quote[];
      setQuotes(quotesData);
    });

    // Subscribe to documents
    const documentsQuery = query(
      collection(db, 'documents'),
      where('companyId', '==', currentCompany.id),
      orderBy('uploadedAt', 'desc')
    );
    const unsubscribeDocuments = onSnapshot(documentsQuery, (snapshot) => {
      const documentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate()
      })) as Document[];
      setDocuments(documentsData);
    });

    setLoading(false);

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeMarkets();
      unsubscribeQuotes();
      unsubscribeDocuments();
    };
  }, [currentCompany?.id]);

  // Product operations
  const addProduct = async (productData: Omit<Product, 'id' | 'companyId'>) => {
    if (!currentCompany?.id) throw new Error('No company selected');
    
    await addDoc(collection(db, 'products'), {
      ...productData,
      companyId: currentCompany.id
    });
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    await updateDoc(doc(db, 'products', productId), updates);
  };

  const deleteProduct = async (productId: string) => {
    await deleteDoc(doc(db, 'products', productId));
  };

  // Order operations
  const addOrder = async (orderData: Omit<Order, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentCompany?.id) throw new Error('No company selected');
    
    await addDoc(collection(db, 'orders'), {
      ...orderData,
      companyId: currentCompany.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: new Date()
    });
  };

  // Market operations
  const addMarket = async (marketData: Omit<Market, 'id' | 'companyId'>) => {
    if (!currentCompany?.id) throw new Error('No company selected');
    
    await addDoc(collection(db, 'markets'), {
      ...marketData,
      companyId: currentCompany.id
    });
  };

  const updateMarket = async (marketId: string, updates: Partial<Market>) => {
    await updateDoc(doc(db, 'markets', marketId), updates);
  };

  const deleteMarket = async (marketId: string) => {
    await deleteDoc(doc(db, 'markets', marketId));
  };

  // Quote operations
  const addQuote = async (quoteData: Omit<Quote, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>) => {
    if (!currentCompany?.id) throw new Error('No company selected');
    
    await addDoc(collection(db, 'quotes'), {
      ...quoteData,
      companyId: currentCompany.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  };

  const updateQuote = async (quoteId: string, updates: Partial<Quote>) => {
    await updateDoc(doc(db, 'quotes', quoteId), {
      ...updates,
      updatedAt: new Date()
    });
  };

  const deleteQuote = async (quoteId: string) => {
    await deleteDoc(doc(db, 'quotes', quoteId));
  };

  // Document operations
  const uploadDocument = async (file: File, metadata: Partial<Document>) => {
    if (!currentCompany?.id || !currentUser?.id) throw new Error('No company or user selected');
    
    // Here you would implement file upload to Google Drive
    // For now, we'll simulate it
    const documentData: Omit<Document, 'id'> = {
      name: file.name,
      type: metadata.type || 'other',
      url: URL.createObjectURL(file), // This would be the Google Drive URL
      size: file.size,
      uploadedBy: currentUser.id,
      uploadedAt: new Date(),
      orderId: metadata.orderId,
      companyId: currentCompany.id
    };
    
    await addDoc(collection(db, 'documents'), documentData);
  };

  const deleteDocument = async (documentId: string) => {
    await deleteDoc(doc(db, 'documents', documentId));
  };

  return (
    <AppContext.Provider value={{
      products,
      orders,
      markets,
      quotes,
      documents,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      addOrder,
      updateOrderStatus,
      addMarket,
      updateMarket,
      deleteMarket,
      addQuote,
      updateQuote,
      deleteQuote,
      uploadDocument,
      deleteDocument
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