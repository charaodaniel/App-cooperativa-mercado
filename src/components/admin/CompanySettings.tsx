import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  Database, 
  Upload, 
  Save,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const CompanySettings: React.FC = () => {
  const { currentCompany } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [settings, setSettings] = useState({
    // General settings
    name: currentCompany?.name || '',
    
    // Theme settings
    primaryColor: currentCompany?.theme?.primaryColor || '#10b981',
    secondaryColor: currentCompany?.theme?.secondaryColor || '#3b82f6',
    accentColor: currentCompany?.theme?.accentColor || '#8b5cf6',
    logo: currentCompany?.theme?.logo || '',
    
    // Data sources
    googleSheetsId: currentCompany?.settings?.googleSheets?.spreadsheetId || '',
    googleApiKey: currentCompany?.settings?.googleSheets?.apiKey || '',
    appSheetId: currentCompany?.settings?.appSheet?.appId || '',
    appSheetKey: currentCompany?.settings?.appSheet?.accessKey || '',
    googleDriveFolder: currentCompany?.settings?.googleDrive?.folderId || '',
    
    // Business settings
    currency: currentCompany?.settings?.business?.currency || 'BRL',
    timezone: currentCompany?.settings?.business?.timezone || 'America/Sao_Paulo',
    taxRate: currentCompany?.settings?.business?.taxRate || 0,
    paymentTerms: currentCompany?.settings?.business?.paymentTerms || '30 dias'
  });

  const handleSave = async () => {
    if (!currentCompany?.id) return;
    
    setLoading(true);
    try {
      await updateDoc(doc(db, 'companies', currentCompany.id), {
        name: settings.name,
        theme: {
          primaryColor: settings.primaryColor,
          secondaryColor: settings.secondaryColor,
          accentColor: settings.accentColor,
          logo: settings.logo
        },
        settings: {
          googleSheets: {
            spreadsheetId: settings.googleSheetsId,
            apiKey: settings.googleApiKey
          },
          appSheet: {
            appId: settings.appSheetId,
            accessKey: settings.appSheetKey
          },
          googleDrive: {
            folderId: settings.googleDriveFolder
          },
          business: {
            currency: settings.currency,
            timezone: settings.timezone,
            taxRate: settings.taxRate,
            paymentTerms: settings.paymentTerms
          }
        }
      });
      
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (type: 'sheets' | 'appsheet' | 'drive') => {
    // Implement connection testing logic here
    alert(`Testando conexão com ${type}...`);
  };

  const tabs = [
    { id: 'general', label: 'Geral', icon: Settings },
    { id: 'theme', label: 'Tema', icon: Palette },
    { id: 'datasources', label: 'Fontes de Dados', icon: Database }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configurações da Empresa</h2>
        <p className="text-gray-600 mt-2">
          Configure as preferências e integrações da sua empresa
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Configurações Gerais</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <Input
              label="Nome da Empresa"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moeda
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="BRL">Real Brasileiro (R$)</option>
                  <option value="USD">Dólar Americano ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuso Horário
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/New_York">Nova York (GMT-5)</option>
                  <option value="Europe/London">Londres (GMT+0)</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Taxa de Imposto (%)"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
              />
              
              <Input
                label="Prazo de Pagamento"
                value={settings.paymentTerms}
                onChange={(e) => setSettings({ ...settings, paymentTerms: e.target.value })}
                placeholder="Ex: 30 dias, À vista"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Theme Settings */}
      {activeTab === 'theme' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Personalização do Tema</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor Primária
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor Secundária
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <Input
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cor de Destaque
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <Input
                    value={settings.accentColor}
                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo da Empresa
              </label>
              <div className="flex items-center space-x-4">
                <Input
                  value={settings.logo}
                  onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                  placeholder="URL do logo ou base64"
                  className="flex-1"
                />
                <Button variant="secondary">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              {settings.logo && (
                <div className="mt-2">
                  <img
                    src={settings.logo}
                    alt="Logo preview"
                    className="h-16 w-auto border border-gray-200 rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Pré-visualização</h4>
              <div 
                className="p-4 rounded-lg text-white"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <h5 className="font-semibold">Cabeçalho Principal</h5>
                <p className="text-sm opacity-90">Exemplo de texto com cor primária</p>
              </div>
              <div className="flex space-x-2 mt-2">
                <div 
                  className="px-3 py-1 rounded text-white text-sm"
                  style={{ backgroundColor: settings.secondaryColor }}
                >
                  Secundária
                </div>
                <div 
                  className="px-3 py-1 rounded text-white text-sm"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  Destaque
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Sources */}
      {activeTab === 'datasources' && (
        <div className="space-y-6">
          {/* Google Sheets */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Google Sheets</h3>
              <p className="text-sm text-gray-600">Configure a integração com Google Sheets</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="ID da Planilha"
                value={settings.googleSheetsId}
                onChange={(e) => setSettings({ ...settings, googleSheetsId: e.target.value })}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              />
              
              <Input
                label="Chave da API"
                type="password"
                value={settings.googleApiKey}
                onChange={(e) => setSettings({ ...settings, googleApiKey: e.target.value })}
                placeholder="AIzaSyC4YourAPIKeyHere"
              />
              
              <Button 
                variant="secondary" 
                onClick={() => testConnection('sheets')}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Testar Conexão
              </Button>
            </CardContent>
          </Card>

          {/* AppSheet */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">AppSheet</h3>
              <p className="text-sm text-gray-600">Configure a integração com AppSheet</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="App ID"
                value={settings.appSheetId}
                onChange={(e) => setSettings({ ...settings, appSheetId: e.target.value })}
                placeholder="your-app-id-here"
              />
              
              <Input
                label="Access Key"
                type="password"
                value={settings.appSheetKey}
                onChange={(e) => setSettings({ ...settings, appSheetKey: e.target.value })}
                placeholder="V2-4bHYourAccessKeyHere"
              />
              
              <Button 
                variant="secondary" 
                onClick={() => testConnection('appsheet')}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Testar Conexão
              </Button>
            </CardContent>
          </Card>

          {/* Google Drive */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Google Drive</h3>
              <p className="text-sm text-gray-600">Configure o armazenamento de documentos</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="ID da Pasta"
                value={settings.googleDriveFolder}
                onChange={(e) => setSettings({ ...settings, googleDriveFolder: e.target.value })}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              />
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Importante:</strong> Os documentos serão armazenados na conta Google Drive 
                  do cliente. O desenvolvedor não tem acesso aos dados sensíveis.
                </p>
              </div>
              
              <Button 
                variant="secondary" 
                onClick={() => testConnection('drive')}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Testar Conexão
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} size="lg">
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  );
};