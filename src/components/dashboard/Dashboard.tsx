import React from 'react';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  Truck
} from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useApp } from '../../contexts/AppContext';

export const Dashboard: React.FC = () => {
  const { orders, products, markets, currentUser } = useApp();

  const stats = React.useMemo(() => {
    if (currentUser?.role === 'cooperative') {
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
      const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      return [
        {
          title: 'Total de Pedidos',
          value: totalOrders,
          icon: ShoppingCart,
          trend: { value: 12, isPositive: true },
          color: 'emerald' as const
        },
        {
          title: 'Faturamento Total',
          value: `R$ ${totalRevenue.toFixed(2)}`,
          icon: TrendingUp,
          trend: { value: 8, isPositive: true },
          color: 'blue' as const
        },
        {
          title: 'Produtos Ativos',
          value: products.length,
          icon: Package,
          color: 'orange' as const
        },
        {
          title: 'Mercados Parceiros',
          value: markets.length,
          icon: Users,
          color: 'purple' as const
        }
      ];
    } else {
      const myOrders = orders.filter(o => o.marketId === currentUser?.marketId);
      const totalSpent = myOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const pendingOrders = myOrders.filter(o => o.status === 'pending').length;
      
      return [
        {
          title: 'Meus Pedidos',
          value: myOrders.length,
          icon: ShoppingCart,
          color: 'emerald' as const
        },
        {
          title: 'Total Gasto',
          value: `R$ ${totalSpent.toFixed(2)}`,
          icon: TrendingUp,
          color: 'blue' as const
        },
        {
          title: 'Pedidos Pendentes',
          value: pendingOrders,
          icon: Clock,
          color: 'orange' as const
        },
        {
          title: 'Produtos Disponíveis',
          value: products.length,
          icon: Package,
          color: 'purple' as const
        }
      ];
    }
  }, [orders, products, markets, currentUser]);

  const recentOrders = React.useMemo(() => {
    if (currentUser?.role === 'cooperative') {
      return orders.slice(0, 5);
    } else {
      return orders.filter(o => o.marketId === currentUser?.marketId).slice(0, 5);
    }
  }, [orders, currentUser]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'delivered':
        return <Truck className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmado';
      case 'delivered':
        return 'Entregue';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao sistema de pedidos da cooperativa
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Pedidos Recentes</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-medium text-gray-900">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.marketName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      R$ {order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {getStatusText(order.status)}
                    </p>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Nenhum pedido encontrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Produtos em Destaque</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      R$ {product.price.toFixed(2)}/{product.unit}
                    </p>
                    <p className="text-sm text-gray-600">
                      Estoque: {product.stock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};