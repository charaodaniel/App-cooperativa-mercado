# Configuração do Google Sheets

Este guia explica como configurar a integração com Google Sheets para o Sistema de Pedidos.

## 📋 Estrutura das Planilhas

### 1. Aba "Produtos"
Colunas necessárias:
- `id` - ID único do produto
- `name` - Nome do produto
- `category` - Categoria (Frutas, Verduras, Grãos, etc.)
- `price` - Preço unitário
- `unit` - Unidade (kg, unid, maço, etc.)
- `stock` - Quantidade em estoque
- `description` - Descrição do produto

### 2. Aba "Pedidos"
Colunas necessárias:
- `id` - ID único do pedido
- `marketId` - ID do mercado
- `marketName` - Nome do mercado
- `status` - Status (pending, confirmed, delivered)
- `totalAmount` - Valor total
- `createdAt` - Data de criação
- `updatedAt` - Data de atualização
- `notes` - Observações
- `items` - Itens do pedido (JSON)

### 3. Aba "Mercados"
Colunas necessárias:
- `id` - ID único do mercado
- `name` - Nome do mercado
- `owner` - Proprietário
- `address` - Endereço
- `phone` - Telefone
- `email` - Email
- `cnpj` - CNPJ

### 4. Aba "Usuarios"
Colunas necessárias:
- `id` - ID único do usuário
- `name` - Nome completo
- `email` - Email (usado para login)
- `role` - Função (cooperative, market)
- `marketId` - ID do mercado (para usuários tipo market)

## 🔧 Configuração da API

### Passo 1: Criar Projeto no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Google Sheets API**:
   - Vá em "APIs & Services" > "Library"
   - Procure por "Google Sheets API"
   - Clique em "Enable"

### Passo 2: Criar Credenciais

#### Para Leitura (API Key):
1. Vá em "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "API Key"
3. Copie a chave gerada
4. (Opcional) Restrinja a chave para Google Sheets API

#### Para Escrita (OAuth2):
1. Vá em "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure o tipo de aplicação como "Web application"
4. Adicione URLs autorizadas:
   - `http://localhost:5173` (desenvolvimento)
   - Sua URL de produção
5. Baixe o arquivo JSON das credenciais

### Passo 3: Configurar Planilha

1. Crie uma nova planilha no Google Sheets
2. Renomeie as abas conforme a estrutura acima
3. Adicione os cabeçalhos nas primeiras linhas
4. Torne a planilha pública para leitura:
   - Clique em "Compartilhar"
   - Altere para "Qualquer pessoa com o link pode visualizar"
5. Copie o ID da planilha da URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

## 🔐 Configuração de Segurança

### Permissões da Planilha:
- **Leitura**: Pública ou compartilhada com service account
- **Escrita**: Requer autenticação OAuth2 ou service account

### Service Account (Recomendado para produção):
1. No Google Cloud Console, vá em "IAM & Admin" > "Service Accounts"
2. Crie uma nova service account
3. Baixe a chave JSON
4. Compartilhe a planilha com o email da service account
5. Configure as variáveis de ambiente com os dados da chave

## 📝 Exemplo de Dados

### Produtos (Aba "Produtos"):
```
id | name | category | price | unit | stock | description
1 | Tomate Orgânico | Verduras | 8.50 | kg | 150 | Tomate orgânico fresco
2 | Alface Crespa | Verduras | 3.20 | maço | 80 | Alface hidropônica
3 | Banana Prata | Frutas | 4.80 | kg | 200 | Banana doce e madura
```

### Mercados (Aba "Mercados"):
```
id | name | owner | address | phone | email | cnpj
1 | Mercado São João | João Silva | Rua das Flores, 123 | (11) 99999-1234 | joao@mercado.com | 12.345.678/0001-90
```

## 🔄 Sincronização de Dados

### Fluxo de Dados:
1. **App → Sheets**: Novos pedidos são enviados para a planilha
2. **Sheets → App**: Produtos e mercados são lidos da planilha
3. **Bidirecionais**: Status de pedidos podem ser atualizados em ambos

### Frequência de Sincronização:
- **Leitura**: A cada carregamento de página ou ação do usuário
- **Escrita**: Imediatamente após ações (criar pedido, atualizar status)

## 🛠️ Implementação no Código

### Configuração das Variáveis:
```env
GOOGLE_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
GOOGLE_API_KEY=AIzaSyC4YourAPIKeyHere
GOOGLE_CLIENT_ID=your-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Uso do Serviço:
```typescript
import { createGoogleSheetsService } from './services/googleSheets';

const sheetsService = createGoogleSheetsService();

// Ler produtos
const produtos = await sheetsService.readData('Produtos!A1:G1000');

// Adicionar pedido
await sheetsService.appendData('Pedidos!A:I', [
  [id, marketId, marketName, status, totalAmount, createdAt, updatedAt, notes, itemsJson]
]);
```

## 📊 Fórmulas Úteis no Sheets

### Cálculos Automáticos:
```
// Total de pedidos por mercado
=COUNTIF(Pedidos!B:B, A2)

// Faturamento por mercado
=SUMIF(Pedidos!B:B, A2, Pedidos!E:E)

// Status dos pedidos
=COUNTIFS(Pedidos!D:D, "pending")
```

### Validação de Dados:
- **Status**: Lista suspensa com valores válidos
- **Categorias**: Lista baseada em valores únicos
- **Preços**: Validação numérica > 0

## 🔍 Troubleshooting

### Problemas Comuns:

1. **Erro 403 (Forbidden)**:
   - Verifique se a API está ativada
   - Confirme as permissões da planilha
   - Valide a chave de API

2. **Erro 404 (Not Found)**:
   - Confirme o ID da planilha
   - Verifique se a aba existe
   - Valide o range especificado

3. **Dados não aparecem**:
   - Verifique a estrutura das colunas
   - Confirme se há dados nas células
   - Valide o formato dos dados

### Logs e Debug:
```typescript
// Ativar logs detalhados
console.log('Lendo dados da planilha:', spreadsheetId);
console.log('Range:', range);
console.log('Dados recebidos:', data);
```

## 📈 Otimizações

### Performance:
- Use ranges específicos em vez de planilhas inteiras
- Implemente cache local para dados que mudam pouco
- Faça leituras em lote quando possível

### Limites da API:
- **Leitura**: 100 requests por 100 segundos por usuário
- **Escrita**: 100 requests por 100 segundos por usuário
- **Quota diária**: 25.000 requests

---

**Com essa configuração, sua aplicação estará totalmente integrada com Google Sheets!** 📊