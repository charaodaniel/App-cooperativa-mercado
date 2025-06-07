import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  FileText, 
  BarChart3, 
  Users,
  History
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { currentUser } = useApp();

  const cooperativeMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'markets', label: 'Mercados', icon: Users },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'analytics', label: 'Análises', icon: BarChart3 }
  ];

  const marketMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'new-order', label: 'Novo Pedido', icon: ShoppingCart },
    { id: 'orders', label: 'Meus Pedidos', icon: History },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'reports', label: 'Relatórios', icon: FileText }
  ];

  const menuItems = currentUser?.role === 'cooperative' ? cooperativeMenuItems : marketMenuItems;

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-100 h-full">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                isActive
                  ? 'bg-emerald-100 text-emerald-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};