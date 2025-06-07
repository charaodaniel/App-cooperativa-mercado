import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { LoginForm } from './components/auth/LoginForm';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { OrdersList } from './components/orders/OrdersList';
import { NewOrder } from './components/orders/NewOrder';
import { ProductsList } from './components/products/ProductsList';
import { MarketsList } from './components/markets/MarketsList';
import { Reports } from './components/reports/Reports';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!currentUser) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrdersList />;
      case 'new-order':
        return <NewOrder />;
      case 'products':
        return <ProductsList />;
      case 'markets':
        return <MarketsList />;
      case 'reports':
        return <Reports />;
      case 'analytics':
        return <Reports />; // Same as reports for now
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;