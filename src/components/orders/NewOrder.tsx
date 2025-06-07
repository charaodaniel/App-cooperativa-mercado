import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useApp } from '../../contexts/AppContext';
import { OrderItem, Product } from '../../types';

export const NewOrder: React.FC = () => {
  const { products, addOrder, currentUser, markets } = useApp();
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const currentMarket = markets.find(m => m.id === currentUser?.marketId);
  
  const categories = React.useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return ['all', ...cats];
  }, [products]);

  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [products, selectedCategory, searchTerm]);

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.total, 0);

  const addToOrder = (product: Product) => {
    const existingItem = selectedItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      setSelectedItems(prev => prev.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
          : item
      ));
    } else {
      const newItem: OrderItem = {
        productId: product.id,
        product,
        quantity: 1,
        unitPrice: product.price,
        total: product.price
      };
      setSelectedItems(prev => [...prev, newItem]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(productId);
      return;
    }
    
    setSelectedItems(prev => prev.map(item =>
      item.productId === productId
        ? { ...item, quantity, total: quantity * item.unitPrice }
        : item
    ));
  };

  const removeFromOrder = (productId: string) => {
    setSelectedItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleSubmitOrder = () => {
    if (selectedItems.length === 0 || !currentMarket) return;

    addOrder({
      marketId: currentMarket.id,
      marketName: currentMarket.name,
      items: selectedItems,
      status: 'pending',
      totalAmount,
      notes: notes.trim() || undefined
    });

    // Reset form
    setSelectedItems([]);
    setNotes('');
    alert('Pedido enviado com sucesso!');
  };

  const getItemQuantity = (productId: string) => {
    const item = selectedItems.find(item => item.productId === productId);
    return item?.quantity || 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Novo Pedido</h2>
        <p className="text-gray-600 mt-2">
          Selecione os produtos para seu pedido
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">Todas as categorias</option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => {
              const quantity = getItemQuantity(product.id);
              
              return (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-emerald-600">
                            R$ {product.price.toFixed(2)}/{product.unit}
                          </span>
                          <span className="text-sm text-gray-500">
                            Estoque: {product.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {quantity === 0 ? (
                        <Button
                          onClick={() => addToOrder(product)}
                          disabled={product.stock === 0}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="mx-3 font-medium">
                            {quantity} {product.unit}
                          </span>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            disabled={quantity >= product.stock}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">Nenhum produto encontrado</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Resumo do Pedido
              </h3>
            </CardHeader>
            <CardContent>
              {selectedItems.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Nenhum item selecionado
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {selectedItems.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} {item.product.unit} × R$ {item.unitPrice.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-2">
                          <span className="font-medium text-gray-900">
                            R$ {item.total.toFixed(2)}
                          </span>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => removeFromOrder(item.productId)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-emerald-600">R$ {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Input
                      label="Observações (opcional)"
                      placeholder="Informações adicionais sobre o pedido..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="text-sm"
                    />
                    
                    <Button
                      onClick={handleSubmitOrder}
                      className="w-full"
                      size="lg"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Finalizar Pedido
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};