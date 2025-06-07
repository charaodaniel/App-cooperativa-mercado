# Sistema de Pedidos para Cooperativa

Um sistema completo de gestão de pedidos desenvolvido para facilitar a comunicação e transações entre cooperativas e mercados parceiros, com integração AppSheet e Google Sheets.

## 📋 Sobre o Projeto

Este sistema foi desenvolvido para digitalizar e otimizar o processo de pedidos entre mercados cadastrados e uma cooperativa fornecedora de produtos alimentícios e/ou agrícolas. A aplicação oferece interfaces distintas para cooperativas e mercados, com integração completa entre plataforma web e mobile via AppSheet.

## 🏗️ Arquitetura da Solução

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │  Google Sheets  │    │  AppSheet App   │
│   (Desktop)     │◄──►│   (Database)    │◄──►│   (Mobile)      │
│                 │    │                 │    │                 │
│ • Cooperativa   │    │ • Produtos      │    │ • Mercados      │
│ • Gestão        │    │ • Pedidos       │    │ • Pedidos       │
│ • Relatórios    │    │ • Mercados      │    │ • Catálogo      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ✨ Funcionalidades

### 🌐 Aplicação Web (Desktop)

#### Para Mercados Parceiros:
- 🛒 **Novo Pedido**: Interface intuitiva para seleção de produtos e criação de pedidos
- 📋 **Meus Pedidos**: Visualização e acompanhamento do histórico de pedidos
- 📊 **Dashboard**: Resumo das atividades e estatísticas do mercado
- 📈 **Relatórios**: Geração de relatórios personalizados com filtros por data
- 🔍 **Catálogo de Produtos**: Consulta completa dos produtos disponíveis

#### Para Cooperativa:
- 📦 **Gestão de Pedidos**: Visualização e gerenciamento de todos os pedidos recebidos
- 🏪 **Mercados Parceiros**: Cadastro e acompanhamento dos mercados
- 📋 **Gestão de Produtos**: CRUD completo de produtos (criar, editar, excluir)
- 📊 **Dashboard Executivo**: Métricas e KPIs do negócio
- 📈 **Relatórios Avançados**: Análises detalhadas de vendas e performance
- 🔄 **Controle de Status**: Atualização de status dos pedidos (Pendente → Confirmado → Entregue)

### 📱 Aplicação Mobile (AppSheet)

#### Para Mercados:
- 📱 **App Nativo**: Interface otimizada para dispositivos móveis
- 🔄 **Sincronização Offline**: Criar pedidos sem conexão com internet
- 📷 **Scanner de Código**: Buscar produtos por código de barras
- 📍 **Geolocalização**: Confirmar localização na entrega
- 🔔 **Notificações Push**: Atualizações de status em tempo real

#### Para Cooperativa:
- 📊 **Dashboard Mobile**: Acompanhamento em tempo real
- ✅ **Aprovação Rápida**: Confirmar pedidos diretamente do celular
- 📋 **Gestão de Estoque**: Atualizar disponibilidade de produtos
- 📈 **Relatórios Mobile**: Visualizar métricas importantes

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Conta Google (para Sheets e AppSheet)

### Passo a Passo

1. **Clone ou baixe o projeto**
   ```bash
   git clone [url-do-repositorio]
   cd sistema-pedidos-cooperativa
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas credenciais
   ```

4. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   - Abra seu navegador e acesse: `http://localhost:5173`

## 🔐 Contas de Demonstração

O sistema vem com contas pré-configuradas para teste:

### Cooperativa (Administrador)
- **Email**: `admin@cooperativa.com`
- **Senha**: `123456`
- **Acesso**: Todas as funcionalidades administrativas

### Mercados Parceiros
- **Mercado São João**
  - Email: `joao@mercadosaojoao.com`
  - Senha: `123456`

- **Supermercado Família**
  - Email: `maria@supermercadofamilia.com`
  - Senha: `123456`

## 📊 Configuração do Google Sheets

### 1. Criar Planilha
1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Configure as abas: `Produtos`, `Pedidos`, `Mercados`, `Usuarios`

### 2. Configurar API
1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Ative a Google Sheets API
3. Crie credenciais (API Key + OAuth2)
4. Configure as variáveis de ambiente

### 3. Estrutura das Abas
Consulte o arquivo `docs/GOOGLE_SHEETS_SETUP.md` para detalhes completos.

## 📱 Configuração do AppSheet

### 1. Criar App
1. Acesse [AppSheet](https://appsheet.com)
2. Crie novo app conectado à planilha
3. Configure estrutura de dados e relacionamentos

### 2. Configurar API
1. Ative a API no AppSheet
2. Copie App ID e Access Key
3. Configure variáveis de ambiente

### 3. Personalizar Interface
- Branding da cooperativa
- Idioma português
- Notificações push
- Funcionalidades offline

Consulte o arquivo `docs/APPSHEET_INTEGRATION.md` para detalhes completos.

## 🌐 Deploy e Hospedagem

### Opções Recomendadas:

#### 1. Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### 2. Netlify
```bash
# Build
npm run build

# Deploy via drag-and-drop ou GitHub
```

#### 3. Firebase Hosting
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Configurar e deploy
firebase init hosting
npm run build
firebase deploy
```

Consulte o arquivo `docs/DEPLOYMENT.md` para guias detalhados de cada plataforma.

## 🔧 Configuração de Variáveis de Ambiente

```env
# Google Sheets
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_ACCESS_TOKEN=your_oauth_access_token_here

# AppSheet
APPSHEET_APP_ID=your_appsheet_app_id_here
APPSHEET_ACCESS_KEY=your_appsheet_access_key_here

# Aplicação
VITE_APP_TITLE=Sistema de Pedidos para Cooperativa
VITE_APP_DESCRIPTION=Sistema de gestão de pedidos
```

## 📱 Como Usar o Sistema

### Para Mercados:

1. **Fazer Login**
   - Acesse a página inicial (web ou app)
   - Use uma das contas de mercado

2. **Criar um Novo Pedido**
   - Web: Clique em "Novo Pedido"
   - App: Toque em "Fazer Pedido"
   - Selecione produtos e quantidades
   - Finalize o pedido

3. **Acompanhar Pedidos**
   - Visualize status em tempo real
   - Receba notificações de atualizações
   - Acesse histórico completo

### Para Cooperativa:

1. **Gerenciar Produtos**
   - Adicione novos produtos
   - Atualize preços e estoque
   - Organize por categorias

2. **Processar Pedidos**
   - Visualize pedidos recebidos
   - Confirme ou rejeite pedidos
   - Atualize status de entrega

3. **Análises e Relatórios**
   - Dashboard com métricas
   - Relatórios por período
   - Exportação de dados

## 🛠️ Tecnologias Utilizadas

### Frontend Web:
- **React 18** + TypeScript
- **Tailwind CSS** para styling
- **Lucide React** para ícones
- **Vite** como build tool

### Backend/Database:
- **Google Sheets** como database
- **Google Sheets API** para integração
- **AppSheet API** para sincronização

### Mobile:
- **AppSheet** para app nativo
- **Sincronização offline**
- **Notificações push**

### Deploy:
- **Vercel/Netlify** para hospedagem web
- **AppSheet** para distribuição mobile

## 📊 Estrutura de Dados

### Produtos
- Nome, categoria, preço, unidade
- Controle de estoque
- Descrição detalhada

### Pedidos
- Itens com quantidades e preços
- Status de acompanhamento (Pendente → Confirmado → Entregue)
- Histórico de alterações
- Observações opcionais

### Mercados
- Dados cadastrais completos
- Estatísticas de compras
- Histórico de pedidos

## 🔄 Fluxo de Pedidos

```
1. Mercado cria pedido (Web/App) → Status: Pendente
2. Cooperativa recebe notificação
3. Cooperativa confirma pedido → Status: Confirmado
4. Cooperativa processa e entrega
5. Status atualizado → Status: Entregue
6. Mercado recebe confirmação
```

## 📈 Relatórios Disponíveis

- **Resumo de Pedidos**: Total, faturamento, ticket médio
- **Status dos Pedidos**: Distribuição por status
- **Top Produtos**: Mais vendidos por quantidade e valor
- **Performance por Mercado**: Análise individual
- **Histórico Detalhado**: Lista completa de transações
- **Exportação**: PDF, Excel, CSV

## 🔔 Notificações e Automações

### Notificações Automáticas:
- **Novo Pedido**: Cooperativa é notificada
- **Status Atualizado**: Mercado recebe confirmação
- **Produto em Falta**: Alertas de estoque
- **Relatórios**: Resumos periódicos por email

### Automações AppSheet:
- **Workflows**: Processos automatizados
- **Email Templates**: Modelos personalizados
- **Push Notifications**: Alertas em tempo real

## 🎨 Interface e UX

### Design Responsivo:
- **Desktop**: Interface completa para gestão
- **Tablet**: Adaptação para telas médias
- **Mobile**: App nativo otimizado

### Tema e Branding:
- **Cores**: Verde cooperativa (personalizável)
- **Logo**: Espaço para logo da cooperativa
- **Idioma**: Português brasileiro
- **Moeda**: Real brasileiro (R$)

## 🔧 Personalização

### Fácil Customização:
- **Cores**: Modifique classes Tailwind CSS
- **Produtos**: Adicione campos personalizados
- **Relatórios**: Crie novos tipos de análise
- **Fluxos**: Adapte processos de negócio
- **Branding**: Logo e cores da cooperativa

## 📞 Suporte e Documentação

### Documentação Técnica:
- `docs/DEPLOYMENT.md` - Guia de deploy
- `docs/GOOGLE_SHEETS_SETUP.md` - Configuração do Sheets
- `docs/APPSHEET_INTEGRATION.md` - Integração AppSheet

### Suporte:
1. Consulte a documentação
2. Teste com contas de demonstração
3. Verifique logs de erro
4. Entre em contato para suporte técnico

## 🚀 Próximos Passos e Melhorias

### Funcionalidades Futuras:
- **Pagamentos Online**: Integração com gateways
- **Logística**: Sistema de entregas
- **Analytics Avançado**: BI e dashboards
- **Multi-cooperativas**: Suporte a múltiplas cooperativas
- **API Pública**: Para integrações externas
- **Machine Learning**: Previsão de demanda

### Integrações Possíveis:
- **ERP**: Sistemas de gestão empresarial
- **Contabilidade**: Softwares contábeis
- **Bancos**: APIs bancárias para pagamentos
- **Logística**: Sistemas de entrega
- **E-commerce**: Plataformas de venda online

## 📊 Métricas e KPIs

### Dashboard Executivo:
- **Volume de Pedidos**: Diário, semanal, mensal
- **Faturamento**: Receita total e por mercado
- **Produtos**: Mais vendidos e em falta
- **Mercados**: Performance individual
- **Crescimento**: Tendências e projeções

### Relatórios Gerenciais:
- **Análise de Vendas**: Por produto, categoria, período
- **Performance de Mercados**: Ranking e estatísticas
- **Controle de Estoque**: Giro e disponibilidade
- **Financeiro**: Faturamento e recebimentos

---

## 🌱 Sobre a Cooperativa

**Desenvolvido para otimizar a gestão de pedidos entre cooperativas e mercados parceiros**

Este sistema representa a digitalização completa do processo de vendas, oferecendo:
- **Eficiência**: Redução de tempo e erros
- **Transparência**: Acompanhamento em tempo real
- **Escalabilidade**: Suporte ao crescimento do negócio
- **Mobilidade**: Acesso de qualquer lugar
- **Integração**: Sincronização entre plataformas

**Transforme sua cooperativa com tecnologia de ponta!** 🚀📱💻