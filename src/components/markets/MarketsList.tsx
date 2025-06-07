import React from 'react';
import { Store, Phone, Mail, MapPin, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useApp } from '../../contexts/AppContext';

export const MarketsList: React.FC = () => {
  const { markets, orders } = useApp();

  const getMarketStats = (marketId: string) => {
    const marketOrders = orders.filter(order => order.marketId === marketId);
    const totalOrders = marketOrders.length;
    const totalSpent = marketOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = marketOrders.filter(order => order.status === 'pending').length;
    
    return { totalOrders, totalSpent, pendingOrders };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mercados Parceiros</h2>
        <p className="text-gray-600 mt-2">
          Gerencie os mercados cadastrados na cooperativa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {markets.map((market) => {
          const stats = getMarketStats(market.id);
          
          return (
            <Card key={market.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Store className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{market.name}</h3>
                      <p className="text-sm text-gray-600">Proprietário: {market.owner}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Ativo
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{market.address}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{market.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{market.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FileText className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">CNPJ: {market.cnpj}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{stats.totalOrders}</p>
                        <p className="text-xs text-gray-600">Pedidos</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-emerald-600">
                          R$ {stats.totalSpent.toFixed(0)}
                        </p>
                        <p className="text-xs text-gray-600">Total Gasto</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-orange-600">{stats.pendingOrders}</p>
                        <p className="text-xs text-gray-600">Pendentes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {markets.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum mercado parceiro cadastrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};