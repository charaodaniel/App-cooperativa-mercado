import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  Download,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Quote, OrderItem } from '../../types';
import jsPDF from 'jspdf';

export const QuoteManager: React.FC = () => {
  const { quotes, products, markets, addQuote, updateQuote, deleteQuote } = useApp();
  const { currentUser, currentCompany } = useAuth();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    marketId: '',
    items: [] as OrderItem[],
    validUntil: '',
    notes: '',
    terms: ''
  });

  const openModal = (quote?: Quote) => {
    if (quote) {
      setSelectedQuote(quote);
      setFormData({
        marketId: quote.marketId,
        items: quote.items,
        validUntil: quote.validUntil.toISOString().split('T')[0],
        notes: quote.notes || '',
        terms: quote.terms || ''
      });
    } else {
      setSelectedQuote(null);
      setFormData({
        marketId: '',
        items: [],
        validUntil: '',
        notes: '',
        terms: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.items.length === 0) {
      alert('Adicione pelo menos um item ao orçamento');
      return;
    }

    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = currentCompany?.settings?.business?.taxRate || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const totalAmount = subtotal + taxAmount;

    const market = markets.find(m => m.id === formData.marketId);
    if (!market) return;

    const quoteData = {
      marketId: formData.marketId,
      marketName: market.name,
      items: formData.items,
      subtotal,
      taxAmount,
      totalAmount,
      validUntil: new Date(formData.validUntil),
      status: 'draft' as const,
      notes: formData.notes,
      terms: formData.terms
    };

    try {
      if (selectedQuote) {
        await updateQuote(selectedQuote.id, quoteData);
      } else {
        await addQuote(quoteData);
      }
      
      setIsModalOpen(false);
      setSelectedQuote(null);
    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Erro ao salvar orçamento');
    }
  };

  const addItem = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = formData.items.find(item => item.productId === productId);
    
    if (existingItem) {
      setFormData({
        ...formData,
        items: formData.items.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
            : item
        )
      });
    } else {
      const newItem: OrderItem = {
        productId: product.id,
        product,
        quantity: 1,
        unitPrice: product.price,
        total: product.price
      };
      setFormData({
        ...formData,
        items: [...formData.items, newItem]
      });
    }
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setFormData({
        ...formData,
        items: formData.items.filter(item => item.productId !== productId)
      });
    } else {
      setFormData({
        ...formData,
        items: formData.items.map(item =>
          item.productId === productId
            ? { ...item, quantity, total: quantity * item.unitPrice }
            : item
        )
      });
    }
  };

  const generatePDF = (quote: Quote) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('ORÇAMENTO', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Orçamento #${quote.id}`, 20, 45);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 55);
    doc.text(`Válido até: ${quote.validUntil.toLocaleDateString('pt-BR')}`, 20, 65);
    
    // Customer info
    doc.text(`Cliente: ${quote.marketName}`, 20, 85);
    
    // Items
    let yPosition = 105;
    doc.text('ITENS:', 20, yPosition);
    yPosition += 10;
    
    quote.items.forEach((item) => {
      doc.text(
        `${item.product.name} - ${item.quantity} ${item.product.unit} x R$ ${item.unitPrice.toFixed(2)} = R$ ${item.total.toFixed(2)}`,
        20,
        yPosition
      );
      yPosition += 10;
    });
    
    // Totals
    yPosition += 10;
    doc.text(`Subtotal: R$ ${quote.subtotal.toFixed(2)}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Impostos: R$ ${quote.taxAmount.toFixed(2)}`, 20, yPosition);
    yPosition += 10;
    doc.setFontSize(14);
    doc.text(`TOTAL: R$ ${quote.totalAmount.toFixed(2)}`, 20, yPosition);
    
    // Notes and terms
    if (quote.notes) {
      yPosition += 20;
      doc.setFontSize(12);
      doc.text('Observações:', 20, yPosition);
      yPosition += 10;
      doc.text(quote.notes, 20, yPosition);
    }
    
    if (quote.terms) {
      yPosition += 20;
      doc.text('Termos e Condições:', 20, yPosition);
      yPosition += 10;
      doc.text(quote.terms, 20, yPosition);
    }
    
    doc.save(`orcamento-${quote.id}.pdf`);
  };

  const getStatusColor = (status: Quote['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-orange-100 text-orange-800'
    };
    return colors[status];
  };

  const getStatusText = (status: Quote['status']) => {
    const texts = {
      draft: 'Rascunho',
      sent: 'Enviado',
      accepted: 'Aceito',
      rejected: 'Rejeitado',
      expired: 'Expirado'
    };
    return texts[status];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orçamentos</h2>
          <p className="text-gray-600 mt-2">
            Crie e gerencie orçamentos para seus clientes
          </p>
        </div>
        
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
        </Button>
      </div>

      {/* Quotes List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orçamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Válido até
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Orçamento #{quote.id}
                          </div>
                          <div className="text-sm text-gray-500">
                            {quote.items.length} {quote.items.length === 1 ? 'item' : 'itens'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {quote.marketName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      R$ {quote.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                        {getStatusText(quote.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {quote.validUntil.toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedQuote(quote);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => generatePDF(quote)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openModal(quote)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            if (confirm('Tem certeza que deseja excluir este orçamento?')) {
                              deleteQuote(quote.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {quotes.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum orçamento criado ainda</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quote Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedQuote ? 'Editar Orçamento' : 'Novo Orçamento'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <select
                value={formData.marketId}
                onChange={(e) => setFormData({ ...formData, marketId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              >
                <option value="">Selecione um cliente</option>
                {markets.map(market => (
                  <option key={market.id} value={market.id}>
                    {market.name}
                  </option>
                ))}
              </select>
            </div>
            
            <Input
              label="Válido até"
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              required
            />
          </div>

          {/* Products Selection */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Adicionar Produtos</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {products.map(product => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => addItem(product.id)}
                  className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="text-xs text-gray-500">
                    R$ {product.price.toFixed(2)}/{product.unit}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Items */}
          {formData.items.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Itens Selecionados</h4>
              <div className="space-y-2">
                {formData.items.map(item => (
                  <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-sm text-gray-600">
                        R$ {item.unitPrice.toFixed(2)}/{item.product.unit}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItemQuantity(item.productId, parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                      <span className="text-sm text-gray-600 w-16">
                        R$ {item.total.toFixed(2)}
                      </span>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => updateItemQuantity(item.productId, 0)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={3}
                placeholder="Observações sobre o orçamento..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Termos e Condições
              </label>
              <textarea
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={3}
                placeholder="Termos e condições do orçamento..."
              />
            </div>
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
              {selectedQuote ? 'Atualizar' : 'Criar'} Orçamento
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quote View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Orçamento #${selectedQuote?.id}`}
        size="lg"
      >
        {selectedQuote && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Informações do Cliente</h4>
                <p className="text-gray-600">{selectedQuote.marketName}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Validade</h4>
                <p className="text-gray-600">
                  {selectedQuote.validUntil.toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Itens</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Produto
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                        Qtd
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                        Preço Unit.
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedQuote.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{item.product.name}</div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.quantity} {item.product.unit}
                        </td>
                        <td className="px-4 py-3 text-center">
                          R$ {item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          R$ {item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R$ {selectedQuote.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impostos:</span>
                  <span>R$ {selectedQuote.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>R$ {selectedQuote.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {selectedQuote.notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedQuote.notes}
                </p>
              </div>
            )}

            {selectedQuote.terms && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Termos e Condições</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedQuote.terms}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => generatePDF(selectedQuote)}
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar PDF
              </Button>
              <Button onClick={() => openModal(selectedQuote)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};