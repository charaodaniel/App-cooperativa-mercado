import React, { useState } from 'react';
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { useApp } from '../../contexts/AppContext';
import { Product } from '../../types';

export const ProductsList: React.FC = () => {
  const { products, currentUser, addProduct, updateProduct, deleteProduct } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    unit: '',
    stock: '',
    description: ''
  });

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

  const openModal = (product?: Product) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        unit: product.unit,
        stock: product.stock.toString(),
        description: product.description
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        category: '',
        price: '',
        unit: '',
        stock: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      unit: formData.unit,
      stock: parseInt(formData.stock),
      description: formData.description
    };

    if (selectedProduct) {
      updateProduct(selectedProduct.id, productData);
    } else {
      addProduct(productData);
    }

    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(productId);
    }
  };

  const isCooperative = currentUser?.role === 'cooperative';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
          <p className="text-gray-600 mt-2">
            {isCooperative ? 'Gerencie o catálogo de produtos' : 'Catálogo de produtos disponíveis'}
          </p>
        </div>
        
        {isCooperative && (
          <Button onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <Package className="w-5 h-5 text-emerald-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Categoria:</span>
                      <span className="text-sm font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Preço:</span>
                      <span className="text-lg font-bold text-emerald-600">
                        R$ {product.price.toFixed(2)}/{product.unit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Estoque:</span>
                      <span className={`text-sm font-medium ${
                        product.stock > 10 ? 'text-green-600' : 
                        product.stock > 0 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {product.stock} {product.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {isCooperative && (
                <div className="flex space-x-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openModal(product)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Nenhum produto encontrado com os filtros aplicados'
                : 'Nenhum produto cadastrado'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'Editar Produto' : 'Novo Produto'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome do Produto"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          
          <Input
            label="Categoria"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Ex: Frutas, Verduras, Grãos"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Preço"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <Input
              label="Unidade"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="kg, unid, maço"
              required
            />
          </div>
          
          <Input
            label="Estoque"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={3}
              placeholder="Descrição do produto..."
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {selectedProduct ? 'Atualizar' : 'Criar'} Produto
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};