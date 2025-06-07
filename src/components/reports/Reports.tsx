import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3,
  TrendingUp,
  Package,
  ShoppingCart
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useApp } from '../../contexts/AppContext';

export const Reports: React.FC = () => {
  const { orders, products, currentUser } = useApp();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredOrders = React.useMemo(() => {
    let filtered = orders;

    // Filter by user role
    if (currentUser?.role === 'market') {
      filtered = filtered.filter(order => order.marketId === currentUser.marketId);
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(order => 
        new Date(order.createdAt) >= new Date(dateFrom)
      );
    }
    
    if (dateTo) {
      filtered = filtered.filter(order => 
        new Date(order.createdAt) <= new Date(dateTo)
      );
    }

    return filtered;
  }, [orders, currentUser, dateFrom, dateTo]);

  const reportData = React.useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const statusCounts = filteredOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topProducts = filteredOrders
      .flatMap(order => order.items)
      .reduce((acc, item) => {
        const key = item.product.name;
        if (!acc[key]) {
          acc[key] = { name: key, quantity: 0, revenue: 0 };
        }
        acc[key].quantity += item.quantity;
        acc[key].revenue += item.total;
        return acc;
      }, {} as Record<string, { name: string; quantity: number; revenue: number }>);

    const topProductsList = Object.values(topProducts)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      statusCounts,
      topProducts: topProductsList
    };
  }, [filteredOrders]);

  const handleExportPDF = () => {
    // Simulate PDF generation
    const content = `
RELATÓRIO DE PEDIDOS
====================

Período: ${dateFrom || 'Início'} até ${dateTo || 'Hoje'}
Gerado em: ${new Date().toLocaleDateString('pt-BR')}

RESUMO GERAL:
- Total de Pedidos: ${reportData.totalOrders}
- Faturamento Total: R$ ${reportData.totalRevenue.toFixed(2)}
- Valor Médio por Pedido: R$ ${reportData.averageOrderValue.toFixed(2)}

STATUS DOS PEDIDOS:
- Pendentes: ${reportData.statusCounts.pending || 0}
- Confirmados: ${reportData.statusCounts.confirmed || 0}
- Entregues: ${reportData.statusCounts.delivered || 0}

TOP 5 PRODUTOS:
${reportData.topProducts.map((product, index) => 
  `${index + 1}. ${product.name} - ${product.quantity} unidades - R$ ${product.revenue.toFixed(2)}`
).join('\n')}

DETALHES DOS PEDIDOS:
${filteredOrders.map(order => 
  `Pedido #${order.id} - ${order.marketName} - R$ ${order.totalAmount.toFixed(2)} - ${order.status}`
).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-pedidos-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendentes';
      case 'confirmed':
        return 'Confirmados';
      case 'delivered':
        return 'Entregues';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
        <p className="text-gray-600 mt-2">
          Analise o desempenho dos pedidos e gere relatórios
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Filtros
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Data inicial"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <Input
              label="Data final"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <div className="flex items-end">
              <Button onClick={handleExportPDF} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.totalOrders}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Faturamento Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {reportData.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {reportData.averageOrderValue.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Produtos Únicos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.topProducts.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Chart */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Status dos Pedidos</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(reportData.statusCounts).map(([status, count]) => {
                const percentage = reportData.totalOrders > 0 
                  ? (count / reportData.totalOrders) * 100 
                  : 0;
                
                const colors = {
                  pending: 'bg-orange-200',
                  confirmed: 'bg-blue-200',
                  delivered: 'bg-green-200'
                };

                return (
                  <div key={status}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {getStatusText(status)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[status as keyof typeof colors] || 'bg-gray-400'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Top 5 Produtos</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.quantity} unidades</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      R$ {product.revenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {reportData.topProducts.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Nenhum produto encontrado no período
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Pedidos do Período</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pedido
                  </th>
                  {currentUser?.role === 'cooperative' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Mercado
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredOrders.slice(0, 10).map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Pedido #{order.id}
                      </div>
                    </td>
                    {currentUser?.role === 'cooperative' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.marketName}</div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        R$ {order.totalAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum pedido encontrado no período</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};