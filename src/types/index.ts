export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  description: string;
  image?: string;
  companyId: string;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  marketId: string;
  marketName: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  companyId: string;
  documents?: Document[];
}

export interface Market {
  id: string;
  name: string;
  owner: string;
  address: string;
  phone: string;
  email: string;
  cnpj: string;
  companyId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'company_admin' | 'cooperative' | 'market';
  companyId?: string;
  marketId?: string;
  permissions: Permission[];
  preferences: UserPreferences;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'pt-BR' | 'en-US';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    widgets: string[];
  };
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  theme: CompanyTheme;
  settings: CompanySettings;
  isActive: boolean;
  createdAt: Date;
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise';
    expiresAt: Date;
    features: string[];
  };
}

export interface CompanyTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo: string;
  favicon: string;
  customCSS?: string;
}

export interface CompanySettings {
  googleSheets: {
    spreadsheetId: string;
    apiKey: string;
    serviceAccountKey?: string;
  };
  appSheet: {
    appId: string;
    accessKey: string;
  };
  googleDrive: {
    folderId: string;
    serviceAccountKey: string;
  };
  notifications: {
    emailTemplates: Record<string, string>;
    webhooks: string[];
  };
  business: {
    currency: string;
    timezone: string;
    taxRate: number;
    paymentTerms: string;
  };
}

export interface Document {
  id: string;
  name: string;
  type: 'invoice' | 'receipt' | 'contract' | 'other';
  url: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  orderId?: string;
  companyId: string;
}

export interface Quote {
  id: string;
  marketId: string;
  marketName: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  validUntil: Date;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  notes?: string;
  terms?: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Report {
  id: string;
  name: string;
  type: 'orders' | 'sales' | 'inventory' | 'customers' | 'financial';
  filters: Record<string, any>;
  data: any[];
  generatedAt: Date;
  generatedBy: string;
  companyId: string;
}