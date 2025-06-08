import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  FileText, 
  BarChart3, 
  Users,
  History,
  Settings,
  UserCog,
  Upload,
  Receipt,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    if (currentUser?.role === 'cooperative' || currentUser?.role === 'company_admin') {
      return [
        ...baseItems,
        { path: '/orders', label: 'Pedidos', icon: ShoppingCart },
        { path: '/products', label: 'Produtos', icon: Package },
        { path: '/markets', label: 'Mercados', icon: Users },
        { path: '/quotes', label: 'Orçamentos', icon: FileText },
        { path: '/documents', label: 'Documentos', icon: Upload },
        { path: '/reports', label: 'Relatórios', icon: BarChart3 },
        ...(currentUser.role === 'company_admin' ? [
          { path: '/admin/users', label: 'Usuários', icon: UserCog },
          { path: '/admin/settings', label: 'Configurações', icon: Settings }
        ] : [])
      ];
    } else if (currentUser?.role === 'market') {
      return [
        ...baseItems,
        { path: '/new-order', label: 'Novo Pedido', icon: ShoppingCart },
        { path: '/orders', label: 'Meus Pedidos', icon: History },
        { path: '/products', label: 'Produtos', icon: Package },
        { path: '/quotes', label: 'Orçamentos', icon: Receipt },
        { path: '/documents', label: 'Documentos', icon: Upload },
        { path: '/reports', label: 'Relatórios', icon: FileText }
      ];
    } else if (currentUser?.role === 'super_admin') {
      return [
        ...baseItems,
        { path: '/orders', label: 'Pedidos', icon: ShoppingCart },
        { path: '/products', label: 'Produtos', icon: Package },
        { path: '/markets', label: 'Mercados', icon: Users },
        { path: '/quotes', label: 'Orçamentos', icon: FileText },
        { path: '/documents', label: 'Documentos', icon: Upload },
        { path: '/reports', label: 'Relatórios', icon: BarChart3 },
        { path: '/admin/users', label: 'Usuários', icon: UserCog },
        { path: '/admin/settings', label: 'Configurações', icon: Settings }
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r border-gray-100 
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="flex justify-end p-4 lg:hidden">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : ''}`} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {currentUser?.role === 'cooperative' ? 'Cooperativa' : 
                   currentUser?.role === 'market' ? 'Mercado' :
                   currentUser?.role === 'company_admin' ? 'Admin' : 'Super Admin'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};