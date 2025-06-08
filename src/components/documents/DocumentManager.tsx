import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  File, 
  Download, 
  Trash2, 
  Search,
  Filter,
  FileText,
  Receipt,
  FileCheck,
  Folder
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { useDropzone } from 'react-dropzone';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Document } from '../../types';

export const DocumentManager: React.FC = () => {
  const { documents, uploadDocument, deleteDocument } = useApp();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadMetadata, setUploadMetadata] = useState({
    type: 'other' as Document['type'],
    orderId: ''
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles(acceptedFiles);
    setIsUploadModalOpen(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const filteredDocuments = React.useMemo(() => {
    let filtered = documents;

    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [documents, typeFilter, searchTerm]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      for (const file of selectedFiles) {
        await uploadDocument(file, uploadMetadata);
      }
      
      setIsUploadModalOpen(false);
      setSelectedFiles([]);
      setUploadMetadata({ type: 'other', orderId: '' });
      alert('Documentos enviados com sucesso!');
    } catch (error) {
      console.error('Error uploading documents:', error);
      alert('Erro ao enviar documentos');
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return;

    try {
      await deleteDocument(documentId);
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Erro ao excluir documento');
    }
  };

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'invoice':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'receipt':
        return <Receipt className="w-5 h-5 text-green-500" />;
      case 'contract':
        return <FileCheck className="w-5 h-5 text-purple-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: Document['type']) => {
    const labels = {
      invoice: 'Fatura',
      receipt: 'Comprovante',
      contract: 'Contrato',
      other: 'Outro'
    };
    return labels[type];
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Documentos</h2>
          <p className="text-gray-600 mt-2">
            Gerencie boletos, comprovantes e outros documentos
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-emerald-600 font-medium">Solte os arquivos aqui...</p>
            ) : (
              <div>
                <p className="text-gray-600 font-medium mb-2">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500">
                  Suporta PDF, imagens, Excel e CSV (máx. 10MB)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Todos os tipos</option>
              <option value="invoice">Faturas</option>
              <option value="receipt">Comprovantes</option>
              <option value="contract">Contratos</option>
              <option value="other">Outros</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {getDocumentIcon(document.type)}
                  <div className="ml-3 flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {document.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getTypeLabel(document.type)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Tamanho:</span>
                  <span>{formatFileSize(document.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Enviado em:</span>
                  <span>
                    {new Date(document.uploadedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {document.orderId && (
                  <div className="flex justify-between">
                    <span>Pedido:</span>
                    <span>#{document.orderId}</span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(document.url, '_blank')}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Baixar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(document.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm || typeFilter !== 'all' 
                ? 'Nenhum documento encontrado com os filtros aplicados'
                : 'Nenhum documento enviado ainda'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Enviar Documentos"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Arquivos Selecionados ({selectedFiles.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <File className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900 truncate">{file.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Documento
            </label>
            <select
              value={uploadMetadata.type}
              onChange={(e) => setUploadMetadata({ 
                ...uploadMetadata, 
                type: e.target.value as Document['type'] 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="invoice">Fatura</option>
              <option value="receipt">Comprovante</option>
              <option value="contract">Contrato</option>
              <option value="other">Outro</option>
            </select>
          </div>
          
          <Input
            label="ID do Pedido (opcional)"
            value={uploadMetadata.orderId}
            onChange={(e) => setUploadMetadata({ 
              ...uploadMetadata, 
              orderId: e.target.value 
            })}
            placeholder="Associar a um pedido específico"
          />
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Segurança:</strong> Os documentos serão armazenados de forma segura 
              no Google Drive da sua empresa. Apenas usuários autorizados terão acesso.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpload}>
              <Upload className="w-4 h-4 mr-2" />
              Enviar Documentos
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};