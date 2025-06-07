import React from 'react';
import { Building2, LogOut, User, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { useApp } from '../../contexts/AppContext';

export const Header: React.FC = () => {
  const { currentUser, logout } = useApp();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Building2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-gray-900">
                  Sistema de Pedidos
                </h1>
                <p className="text-sm text-gray-500">
                  {currentUser?.role === 'cooperative' ? 'Cooperativa' : 'Mercado Parceiro'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-full">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
              </div>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
                className="flex items-center"
              >
                <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};