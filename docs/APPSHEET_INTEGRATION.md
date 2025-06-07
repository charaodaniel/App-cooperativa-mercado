# Integração com AppSheet

Este guia explica como integrar o sistema web com um app AppSheet para criar uma solução completa mobile + web.

## 📱 Visão Geral da Integração

### Arquitetura:
```
Google Sheets ←→ AppSheet App (Mobile) ←→ Web App (Desktop)
```

### Benefícios:
- **Mobile**: App nativo para mercados (pedidos em movimento)
- **Web**: Interface completa para cooperativa (gestão)
- **Sincronização**: Dados sempre atualizados entre plataformas

## 🔧 Configuração do AppSheet

### Passo 1: Criar App no AppSheet

1. Acesse [appsheet.com](https://appsheet.com)
2. Faça login com conta Google
3. Clique em "Create" > "App"
4. Conecte à sua planilha Google Sheets
5. Escolha "Start with your own data"

### Passo 2: Configurar Estrutura de Dados

#### Tabelas Principais:
- **Produtos**: Catálogo de produtos da cooperativa
- **Pedidos**: Pedidos realizados pelos mercados
- **Mercados**: Cadastro dos mercados parceiros
- **Usuarios**: Controle de acesso ao app

#### Relacionamentos:
```
Mercados (1) ←→ (N) Pedidos
Pedidos (1) ←→ (N) ItensPedido
Produtos (1) ←→ (N) ItensPedido
```

### Passo 3: Configurar Views (Telas)

#### Para Mercados:
1. **Dashboard**: Resumo de pedidos e estatísticas
2. **Novo Pedido**: Formulário para criar pedidos
3. **Meus Pedidos**: Lista de pedidos do mercado
4. **Catálogo**: Visualização de produtos disponíveis

#### Para Cooperativa:
1. **Dashboard Admin**: Visão geral do negócio
2. **Gestão de Pedidos**: Lista e edição de pedidos
3. **Gestão de Produtos**: CRUD de produtos
4. **Relatórios**: Análises e exportações

## 🔐 Configuração de Segurança

### Controle de Acesso:

1. **Security > Require Sign-in**: Ativado
2. **Users**: Configurar emails dos usuários
3. **Role-based Security**: 
   - **Mercado**: Acesso apenas aos próprios dados
   - **Cooperativa**: Acesso completo

### Filtros de Segurança:
```
// Para tabela Pedidos - Mercados veem apenas seus pedidos
[marketId] = USEREMAIL()

// Para tabela Mercados - Mercados veem apenas próprio cadastro
[email] = USEREMAIL()
```

## 📊 API do AppSheet

### Ativação da API:

1. Vá em "Manage" > "Integrations" > "API"
2. Ative "Enable API for this app"
3. Copie o **App ID** e **Access Key**
4. Configure rate limits se necessário

### Endpoints Disponíveis:

#### Listar Dados:
```http
POST https://api.appsheet.com/api/v2/apps/{app-id}/tables/{table-name}/Action

{
  "Action": "Find",
  "Properties": {
    "Locale": "pt-BR",
    "Timezone": "America/Sao_Paulo"
  },
  "Rows": []
}
```

#### Adicionar Dados:
```http
POST https://api.appsheet.com/api/v2/apps/{app-id}/tables/{table-name}/Action

{
  "Action": "Add",
  "Properties": {
    "Locale": "pt-BR"
  },
  "Rows": [
    {
      "campo1": "valor1",
      "campo2": "valor2"
    }
  ]
}
```

#### Atualizar Dados:
```http
POST https://api.appsheet.com/api/v2/apps/{app-id}/tables/{table-name}/Action

{
  "Action": "Edit",
  "Properties": {
    "Locale": "pt-BR"
  },
  "Rows": [
    {
      "Key": "chave-do-registro",
      "campo1": "novo-valor"
    }
  ]
}
```

## 🔄 Sincronização Bidirecional

### Fluxos de Dados:

#### Web → AppSheet:
- Novos produtos criados na web aparecem no app
- Status de pedidos atualizados na web sincronizam no app
- Alterações de estoque refletem no app

#### AppSheet → Web:
- Pedidos criados no app aparecem na web
- Atualizações de dados do mercado sincronizam
- Novos usuários cadastrados no app

### Implementação:

```typescript
// Sincronização automática a cada 30 segundos
setInterval(async () => {
  await syncWithAppSheet();
}, 30000);

async function syncWithAppSheet() {
  try {
    // Buscar novos pedidos do AppSheet
    const newOrders = await appSheetService.getData('Pedidos');
    
    // Atualizar dados locais
    updateLocalOrders(newOrders);
    
    // Enviar atualizações para AppSheet
    await pushUpdatesToAppSheet();
  } catch (error) {
    console.error('Erro na sincronização:', error);
  }
}
```

## 📱 Configuração do App Mobile

### Customização da Interface:

1. **Branding**: Logo e cores da cooperativa
2. **Idioma**: Português brasileiro
3. **Formato de dados**: Moeda brasileira (R$)
4. **Timezone**: America/Sao_Paulo

### Funcionalidades Específicas:

#### Para Mercados:
- **Pedidos Offline**: Criar pedidos sem internet
- **Scanner de Código**: Buscar produtos por código
- **Geolocalização**: Confirmar localização na entrega
- **Notificações Push**: Atualizações de status

#### Configurações Avançadas:
```yaml
# app.yml (configuração do AppSheet)
Features:
  - OfflineSync: true
  - PushNotifications: true
  - BarcodeScanner: true
  - GPS: true
  
Localization:
  Language: pt-BR
  Currency: BRL
  DateFormat: dd/MM/yyyy
  TimeZone: America/Sao_Paulo
```

## 🔔 Notificações e Automações

### Configurar Workflows:

1. **Novo Pedido**: Notificar cooperativa
2. **Status Atualizado**: Notificar mercado
3. **Produto em Falta**: Alertar administradores
4. **Relatório Diário**: Enviar resumo por email

### Exemplo de Workflow:
```yaml
# Workflow: Novo Pedido
Trigger: Quando novo registro é adicionado em "Pedidos"
Condition: [Status] = "pending"
Actions:
  - Send Email:
      To: admin@cooperativa.com
      Subject: "Novo Pedido #[ID]"
      Body: "Mercado [MarketName] fez um novo pedido..."
  - Send Push Notification:
      To: [MarketEmail]
      Message: "Seu pedido foi recebido!"
```

## 📊 Relatórios e Analytics

### Dashboards no AppSheet:

1. **Chart Views**: Gráficos de vendas e pedidos
2. **Summary Views**: Totalizadores por período
3. **Map Views**: Localização dos mercados
4. **Calendar Views**: Cronograma de entregas

### Integração com Google Analytics:
```javascript
// Tracking de eventos no app
gtag('event', 'pedido_criado', {
  'event_category': 'pedidos',
  'event_label': 'novo_pedido',
  'value': totalAmount
});
```

## 🚀 Deploy do App

### Publicação:

1. **Testing**: Testar com usuários beta
2. **Deployment**: Publicar para usuários finais
3. **App Store**: Submeter para lojas (opcional)

### Distribuição:
- **Link direto**: Compartilhar URL do app
- **QR Code**: Para instalação rápida
- **Email**: Convites automáticos

## 🔧 Manutenção e Monitoramento

### Logs e Debugging:
- **Usage Analytics**: Relatórios de uso do app
- **Error Logs**: Monitoramento de erros
- **Performance**: Métricas de velocidade

### Atualizações:
- **Schema Changes**: Alterações na estrutura de dados
- **Feature Updates**: Novas funcionalidades
- **Bug Fixes**: Correções de problemas

## 📞 Suporte aos Usuários

### Documentação:
- **Manual do Usuário**: Guia passo a passo
- **FAQ**: Perguntas frequentes
- **Vídeos**: Tutoriais em vídeo

### Canais de Suporte:
- **Email**: suporte@cooperativa.com
- **WhatsApp**: Suporte via chat
- **Telefone**: Linha direta para emergências

---

**Com essa integração, você terá uma solução completa mobile + web para o sistema de pedidos!** 📱💻