# Sistema Avançado de Pedidos para Cooperativas

Um sistema completo e avançado de gestão de pedidos desenvolvido para múltiplas cooperativas, com suporte multiempresa, segurança avançada, Firebase Authentication, e integração completa com AppSheet e Google Sheets.

## 🚀 Principais Funcionalidades

### 🏢 **Suporte Multiempresa**
- **Isolamento completo** de dados por empresa
- **Temas personalizáveis** (cores, logos, layouts)
- **Configurações dinâmicas** por empresa
- **Múltiplas cooperativas** no mesmo sistema

### 🔐 **Segurança Avançada**
- **Firebase Authentication** para autenticação robusta
- **Controle de permissões** granular por usuário
- **Dados sensíveis** armazenados no Google Drive do cliente
- **Desenvolvedor isento** de responsabilidade por vazamentos

### 👥 **Gestão Avançada de Usuários**
- **Múltiplos administradores** com diferentes níveis
- **Cadastro, edição e remoção** via painel administrativo
- **Controle de permissões** por recurso e ação
- **Integração completa** com Firebase Auth

### 📄 **Gestão de Documentos**
- **Upload seguro** de boletos e comprovantes
- **Organização automática** por cooperativa/cliente/pedido
- **Armazenamento** no Google Drive do cliente
- **Controle de acesso** baseado em permissões

### ⚙️ **Configuração Dinâmica**
- **Painel administrativo** para configurar APIs
- **URLs e IDs** de planilhas configuráveis
- **Sem necessidade** de alterar código
- **Testes de conexão** integrados

### 🎨 **Personalização Completa**
- **Temas customizáveis** por empresa
- **Logos e cores** personalizáveis
- **Preferências** salvas por usuário
- **Layouts adaptativos**

### 📱 **Responsividade Total**
- **Interface otimizada** para mobile e tablet
- **Layouts adaptativos** para todas as telas
- **Navegação intuitiva** em dispositivos móveis
- **Performance otimizada**

### 📊 **Relatórios e Análises**
- **Geração de PDFs** e arquivos CSV
- **Filtros avançados** por data, cliente, produto
- **Permissões de acesso** respeitadas
- **Export personalizado**

### 💰 **Sistema de Orçamentos**
- **Criação detalhada** com impostos e condições
- **Exportação em PDF** profissional
- **Controle de validade** e status
- **Conversão para pedidos**

## 🏗️ Arquitetura da Solução

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │    Firebase     │    │  Google Drive   │
│   (Multi-tenant)│◄──►│   (Auth + DB)   │◄──►│  (Documents)    │
│                 │    │                 │    │                 │
│ • Empresa A     │    │ • Authentication│    │ • Boletos       │
│ • Empresa B     │    │ • Firestore     │    │ • Comprovantes  │
│ • Empresa C     │    │ • Real-time     │    │ • Contratos     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Google Sheets  │    │   AppSheet      │    │   Relatórios    │
│  (Data Source)  │    │   (Mobile App)  │    │   (PDF/CSV)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tecnologias Utilizadas

### **Frontend:**
- **React 18** + TypeScript
- **React Router** para navegação
- **Tailwind CSS** para styling responsivo
- **Lucide React** para ícones
- **React Hook Form** para formulários
- **React Dropzone** para upload de arquivos

### **Backend/Database:**
- **Firebase Authentication** para autenticação
- **Firestore** para banco de dados real-time
- **Firebase Storage** para arquivos
- **Google Sheets API** para integração
- **Google Drive API** para documentos

### **Integrações:**
- **AppSheet** para app mobile nativo
- **Google Workspace** para produtividade
- **jsPDF** para geração de PDFs
- **React Select** para seletores avançados

### **Deploy:**
- **Vercel/Netlify** para hospedagem web
- **Firebase Hosting** alternativa
- **GitHub Actions** para CI/CD

## 🚀 Como Executar o Projeto

### **Pré-requisitos:**
- Node.js 18+ 
- npm ou yarn
- Conta Firebase
- Conta Google (Sheets, Drive, AppSheet)

### **1. Clone e Instale:**
```bash
git clone [url-do-repositorio]
cd sistema-pedidos-cooperativa-avancado
npm install
```

### **2. Configure Firebase:**
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative Authentication (Email/Password)
3. Ative Firestore Database
4. Ative Storage
5. Copie as credenciais para `.env`

### **3. Configure Variáveis de Ambiente:**
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

### **4. Execute em Desenvolvimento:**
```bash
npm run dev
```

### **5. Acesse a Aplicação:**
- Abra: `http://localhost:5173`

## 🔐 Configuração de Segurança

### **Firebase Rules (Firestore):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Company data access based on user's company
    match /companies/{companyId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.companyId == companyId;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['company_admin', 'super_admin'];
    }
    
    // Products, orders, etc. - company isolated
    match /{collection}/{document} {
      allow read, write: if request.auth != null && 
        resource.data.companyId == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.companyId;
    }
  }
}
```

### **Firebase Rules (Storage):**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /companies/{companyId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.companyId == companyId;
    }
  }
}
```

## 👥 Tipos de Usuário e Permissões

### **Super Admin:**
- Acesso a todas as empresas
- Criação de novas empresas
- Gestão de usuários globais
- Configurações do sistema

### **Company Admin:**
- Gestão completa da empresa
- Configuração de integrações
- Gestão de usuários da empresa
- Personalização de tema

### **Cooperative:**
- Gestão de produtos e pedidos
- Relatórios e análises
- Aprovação de pedidos
- Gestão de mercados

### **Market:**
- Criação de pedidos
- Visualização de produtos
- Histórico de pedidos
- Upload de documentos

## 📊 Estrutura de Dados

### **Companies:**
```typescript
{
  id: string;
  name: string;
  logo?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logo: string;
  };
  settings: {
    googleSheets: { spreadsheetId, apiKey };
    appSheet: { appId, accessKey };
    googleDrive: { folderId };
    business: { currency, timezone, taxRate };
  };
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise';
    features: string[];
  };
}
```

### **Users:**
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'company_admin' | 'cooperative' | 'market';
  companyId?: string;
  permissions: Permission[];
  preferences: UserPreferences;
  isActive: boolean;
}
```

## 🔧 Configuração por Empresa

### **Google Sheets:**
1. Crie uma planilha no Google Sheets
2. Configure as abas: `Produtos`, `Pedidos`, `Mercados`
3. Obtenha o ID da planilha
4. Configure no painel administrativo

### **AppSheet:**
1. Crie um app no AppSheet
2. Conecte à planilha Google Sheets
3. Configure a API
4. Adicione credenciais no sistema

### **Google Drive:**
1. Crie uma pasta no Google Drive
2. Configure permissões de acesso
3. Obtenha o ID da pasta
4. Configure no painel administrativo

## 📱 Funcionalidades Mobile

### **Responsividade:**
- **Breakpoints otimizados** para todos os dispositivos
- **Touch-friendly** interface
- **Navegação por gestos**
- **Performance otimizada**

### **PWA Ready:**
- **Instalável** como app nativo
- **Funciona offline** (cache estratégico)
- **Push notifications** (futuro)
- **App-like experience**

## 📈 Relatórios e Analytics

### **Tipos de Relatórios:**
- **Vendas por período**
- **Performance por mercado**
- **Produtos mais vendidos**
- **Análise financeira**
- **Relatórios customizados**

### **Formatos de Export:**
- **PDF profissional**
- **CSV para análise**
- **Excel com formatação**
- **Gráficos interativos**

## 🔄 Integrações Disponíveis

### **Google Workspace:**
- **Sheets** para dados
- **Drive** para documentos
- **Gmail** para notificações
- **Calendar** para agendamentos

### **AppSheet:**
- **App mobile nativo**
- **Sincronização offline**
- **Notificações push**
- **Workflows automatizados**

### **APIs Externas:**
- **Correios** para CEP
- **Bancos** para pagamentos (futuro)
- **ERP** para integração (futuro)
- **Contabilidade** para fiscal (futuro)

## 🚀 Deploy e Hospedagem

### **Vercel (Recomendado):**
```bash
npm i -g vercel
vercel
```

### **Netlify:**
```bash
npm run build
# Deploy via interface ou CLI
```

### **Firebase Hosting:**
```bash
npm install -g firebase-tools
firebase init hosting
npm run build
firebase deploy
```

## 🔒 Segurança e Compliance

### **Proteção de Dados:**
- **LGPD compliant**
- **Dados criptografados**
- **Acesso auditado**
- **Backup automático**

### **Responsabilidades:**
- **Cliente:** Responsável pelos dados no Google Drive
- **Desenvolvedor:** Isento de vazamentos por permissões do cliente
- **Sistema:** Logs de auditoria e controle de acesso

## 📞 Suporte e Manutenção

### **Documentação:**
- **Guias de usuário** por perfil
- **Tutoriais em vídeo**
- **FAQ completo**
- **API documentation**

### **Suporte Técnico:**
- **Email:** suporte@sistema.com
- **Chat:** Suporte em tempo real
- **Telefone:** Linha direta para emergências
- **Documentação:** Base de conhecimento

## 🔮 Roadmap Futuro

### **Próximas Funcionalidades:**
- **Pagamentos online** integrados
- **Sistema de entregas** com rastreamento
- **BI avançado** com dashboards
- **Machine Learning** para previsões
- **API pública** para integrações

### **Melhorias Planejadas:**
- **Performance** otimizada
- **UX/UI** aprimorada
- **Acessibilidade** completa
- **Internacionalização** (i18n)

## 📊 Métricas e KPIs

### **Dashboard Executivo:**
- **Volume de pedidos** em tempo real
- **Faturamento** por empresa/período
- **Performance** de mercados
- **Crescimento** e tendências
- **Alertas** automáticos

### **Analytics Avançado:**
- **Comportamento** do usuário
- **Conversão** de orçamentos
- **Sazonalidade** de produtos
- **Previsão** de demanda

---

## 🌟 **Transforme sua Cooperativa com Tecnologia de Ponta!**

**Sistema completo, seguro e escalável para o futuro do seu negócio.** 🚀

### **Benefícios Principais:**
✅ **Multiempresa** - Múltiplas cooperativas no mesmo sistema  
✅ **Segurança Avançada** - Firebase + controle de permissões  
✅ **Mobile First** - Responsivo e PWA ready  
✅ **Documentos Seguros** - Google Drive do cliente  
✅ **Configuração Dinâmica** - Sem alteração de código  
✅ **Relatórios Profissionais** - PDF e CSV personalizados  
✅ **Orçamentos Completos** - Com impostos e condições  
✅ **Escalabilidade** - Suporta crescimento ilimitado  

**Entre em contato para implementação e customização!** 📧💼