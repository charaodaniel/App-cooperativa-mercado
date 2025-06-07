# Guia de Deploy - Sistema de Pedidos para Cooperativa

Este documento explica como fazer o deploy da aplicação em diferentes plataformas de hospedagem.

## 🚀 Opções de Deploy

### 1. Vercel (Recomendado)

A Vercel é uma plataforma otimizada para aplicações React e oferece deploy gratuito.

#### Passo a Passo:

1. **Criar conta na Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Faça login com GitHub, GitLab ou Bitbucket

2. **Preparar o projeto**
   ```bash
   # Instalar Vercel CLI (opcional)
   npm i -g vercel
   
   # Build do projeto
   npm run build
   ```

3. **Deploy via GitHub (Recomendado)**
   - Faça push do código para um repositório GitHub
   - Na Vercel, clique em "New Project"
   - Conecte seu repositório GitHub
   - Configure as variáveis de ambiente (se necessário)
   - Clique em "Deploy"

4. **Deploy via CLI**
   ```bash
   # Na pasta do projeto
   vercel
   
   # Seguir as instruções no terminal
   # Escolher configurações do projeto
   ```

5. **Configurar domínio personalizado (opcional)**
   - No dashboard da Vercel
   - Vá em "Domains"
   - Adicione seu domínio personalizado

### 2. Netlify

Outra excelente opção para hospedagem de aplicações estáticas.

#### Passo a Passo:

1. **Criar conta na Netlify**
   - Acesse [netlify.com](https://netlify.com)
   - Faça cadastro gratuito

2. **Deploy via GitHub**
   - Conecte seu repositório GitHub
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Deploy via drag-and-drop**
   ```bash
   # Build do projeto
   npm run build
   
   # Arraste a pasta 'dist' para o Netlify
   ```

### 3. GitHub Pages

Opção gratuita usando o próprio GitHub.

#### Passo a Passo:

1. **Configurar GitHub Actions**
   - Criar arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. **Configurar GitHub Pages**
   - Vá em Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages

### 4. Firebase Hosting

Plataforma do Google com CDN global.

#### Passo a Passo:

1. **Instalar Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Configurar projeto**
   ```bash
   firebase login
   firebase init hosting
   
   # Configurações:
   # Public directory: dist
   # Single-page app: Yes
   # Overwrite index.html: No
   ```

3. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## 🔧 Configuração de Variáveis de Ambiente

### Para Vercel:
1. No dashboard do projeto
2. Vá em "Settings" > "Environment Variables"
3. Adicione as variáveis do arquivo `.env.example`

### Para Netlify:
1. No dashboard do projeto
2. Vá em "Site settings" > "Environment variables"
3. Adicione as variáveis necessárias

### Para outras plataformas:
- Consulte a documentação específica da plataforma
- Geralmente há uma seção de "Environment Variables" ou "Config Vars"

## 📊 Integração com Google Sheets

### Configuração:

1. **Criar projeto no Google Cloud Console**
   - Acesse [console.cloud.google.com](https://console.cloud.google.com)
   - Crie um novo projeto
   - Ative a Google Sheets API

2. **Obter credenciais**
   - Vá em "Credenciais"
   - Crie uma chave de API
   - Configure OAuth2 (para escrita)

3. **Configurar planilha**
   - Crie uma planilha no Google Sheets
   - Configure as abas: Produtos, Pedidos, Mercados
   - Copie o ID da planilha da URL

4. **Configurar variáveis**
   ```env
   GOOGLE_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
   GOOGLE_API_KEY=AIzaSyC4YourAPIKeyHere
   ```

## 📱 Integração com AppSheet

### Configuração:

1. **Criar app no AppSheet**
   - Acesse [appsheet.com](https://appsheet.com)
   - Crie um novo app conectado à sua planilha

2. **Configurar API**
   - Vá em "Manage" > "Integrations" > "API"
   - Ative a API
   - Copie o App ID e Access Key

3. **Configurar variáveis**
   ```env
   APPSHEET_APP_ID=your-app-id-here
   APPSHEET_ACCESS_KEY=V2-4bHYourAccessKeyHere
   ```

## 🔒 Segurança

### Boas práticas:

1. **Nunca commitar credenciais**
   - Use sempre variáveis de ambiente
   - Adicione `.env` ao `.gitignore`

2. **Configurar CORS**
   - Configure domínios permitidos nas APIs
   - Restrinja acesso por IP se necessário

3. **Usar HTTPS**
   - Todas as plataformas mencionadas oferecem HTTPS gratuito
   - Configure redirecionamento HTTP → HTTPS

## 📈 Monitoramento

### Ferramentas recomendadas:

1. **Google Analytics**
   - Adicione o código de tracking
   - Configure eventos personalizados

2. **Sentry** (para erros)
   ```bash
   npm install @sentry/react
   ```

3. **Logs da plataforma**
   - Vercel: Function logs
   - Netlify: Function logs
   - Firebase: Cloud Functions logs

## 🚀 Deploy Automatizado

### Configuração de CI/CD:

1. **Vercel**: Deploy automático via GitHub
2. **Netlify**: Deploy automático via GitHub
3. **GitHub Actions**: Para outras plataformas

### Exemplo de workflow:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build
    - run: npm run deploy
```

## 📞 Suporte

Para problemas de deploy:

1. Verifique os logs da plataforma
2. Confirme as variáveis de ambiente
3. Teste o build local: `npm run build`
4. Consulte a documentação da plataforma específica

---

**Escolha a plataforma que melhor se adequa às suas necessidades e orçamento!** 🚀