import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, Company } from '../types';

interface AuthContextType {
  currentUser: User | null;
  currentCompany: Company | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  switchCompany: (companyId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        try {
          // Get user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setCurrentUser(userData);
            
            // Load company data if user has companyId
            if (userData.companyId) {
              const companyDoc = await getDoc(doc(db, 'companies', userData.companyId));
              if (companyDoc.exists()) {
                setCurrentCompany(companyDoc.data() as Company);
              }
            }
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        setCurrentUser(null);
        setCurrentCompany(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setCurrentCompany(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      const newUser: User = {
        id: user.uid,
        email,
        name: userData.name || '',
        role: userData.role || 'market',
        companyId: userData.companyId,
        marketId: userData.marketId,
        permissions: userData.permissions || [],
        preferences: {
          theme: 'light',
          language: 'pt-BR',
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          dashboard: {
            layout: 'grid',
            widgets: ['orders', 'products', 'analytics']
          }
        },
        isActive: true,
        createdAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), newUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const switchCompany = async (companyId: string) => {
    if (!currentUser) return;
    
    try {
      const companyDoc = await getDoc(doc(db, 'companies', companyId));
      if (companyDoc.exists()) {
        setCurrentCompany(companyDoc.data() as Company);
        
        // Update user's current company
        await setDoc(doc(db, 'users', currentUser.id), {
          ...currentUser,
          companyId
        }, { merge: true });
      }
    } catch (error) {
      console.error('Error switching company:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      currentCompany,
      firebaseUser,
      loading,
      login,
      logout,
      register,
      switchCompany
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};