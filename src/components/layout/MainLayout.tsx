import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentCompany } = useAuth();

  // Apply company theme
  React.useEffect(() => {
    if (currentCompany?.theme) {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', currentCompany.theme.primaryColor);
      root.style.setProperty('--secondary-color', currentCompany.theme.secondaryColor);
      root.style.setProperty('--accent-color', currentCompany.theme.accentColor);
    }
  }, [currentCompany?.theme]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};