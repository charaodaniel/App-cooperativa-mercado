import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { LoginForm } from './components/auth/LoginForm';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './components/dashboard/Dashboard';
import { OrdersList } from './components/orders/OrdersList';
import { NewOrder } from './components/orders/NewOrder';
import { ProductsList } from './components/products/ProductsList';
import { MarketsList } from './components/markets/MarketsList';
import { Reports } from './components/reports/Reports';
import { UserManagement } from './components/admin/UserManagement';
import { CompanySettings } from './components/admin/CompanySettings';
import { DocumentManager } from './components/documents/DocumentManager';
import { QuoteManager } from './components/quotes/QuoteManager';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <LoginForm />;
  }

  return (
    <AppProvider>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/new-order" element={<NewOrder />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/markets" element={<MarketsList />} />
          <Route path="/quotes" element={<QuoteManager />} />
          <Route path="/documents" element={<DocumentManager />} />
          <Route path="/reports" element={<Reports />} />
          
          {/* Admin routes */}
          {(currentUser.role === 'super_admin' || currentUser.role === 'company_admin') && (
            <>
              <Route path="/admin/users\" element={<UserManagement />} />
              <Route path="/admin/settings" element={<CompanySettings />} />
            </>
          )}
          
          <Route path="*" element={<Navigate to="/dashboard\" replace />} />
        </Routes>
      </MainLayout>
    </AppProvider>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <AppRoutes />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;