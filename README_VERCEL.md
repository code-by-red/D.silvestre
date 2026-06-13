# Configuração para Vercel

## � Estrutura do Projeto

```
homenagem d,silvestre/
├── public/              # Arquivos estáticos (servidos pela Vercel)
│   ├── index.html      # HTML principal
│   ├── styles.css      # Estilos CSS
│   └── script.js       # JavaScript do frontend
├── server.js           # Backend Node.js (API)
├── package.json        # Dependências
├── vercel.json         # Configuração da Vercel
├── .env                # Variáveis de ambiente (não enviado ao GitHub)
└── .env.example        # Exemplo de variáveis de ambiente
```

## � Deploy na Vercel

### 1. Configurar Variáveis de Ambiente na Vercel

1. Acesse seu projeto na Vercel: https://vercel.com/dashboard
2. Vá em **Settings** > **Environment Variables**
3. Adicione as seguintes variáveis:

#### GOOGLE_SHEET_ID
- ID da sua planilha Google Sheets
- Exemplo: `16l5ptYdLO_sH_aFujp3jLKF2n185d6OAPLNwW0hCbKs`

#### GOOGLE_SERVICE_ACCOUNT
- Credenciais JSON completa da Google Service Account
- Copie todo o conteúdo JSON do arquivo de credenciais
- **IMPORTANTE:** Use aspas duplas e escape as quebras de linha com `\n`

Exemplo de como formatar:
```
{"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCgApFg0Q0a7wGJ\n...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"...","universe_domain":"googleapis.com"}
```

#### PORT
- Valor: `3000`

### 2. Redeploy

Após configurar as variáveis de ambiente:
1. Vá em **Deployments** no dashboard da Vercel
2. Clique no botão **...** (três pontos) no deploy mais recente
3. Selecione **Redeploy**

**Nota:** Os arquivos estáticos agora estão no diretório `public/`, que é o padrão da Vercel. Isso resolve os problemas de MIME type.

### 3. Compartilhar Planilha com Service Account

1. No Google Cloud Console, encontre o email da service account (campo `client_email` nas credenciais)
2. Acesse sua planilha Google Sheets
3. Clique em **Compartilhar**
4. Adicione o email da service account como **Editor**

### 4. Configurar Cabeçalhos da Planilha

Na planilha Google Sheets, configure os cabeçalhos na **linha 1**:
- **A1:** `nome`
- **B1:** `cidade`
- **C1:** `mensagem`
- **D1:** `data`

## 🔧 Solução de Problemas

### Erro: MIME type 'text/html' para CSS/JS
- Isso foi corrigido no `server.js` com configuração de MIME types
- Faça um redeploy após atualizar o código

### Erro: submitComment is not defined
- Verifique se o `script.js` está sendo carregado corretamente
- Abra o console do navegador (F12) para ver erros

### Erro: Variáveis de ambiente não funcionando
- Verifique se as variáveis estão configuradas na Vercel
- Confirme que os nomes estão exatamente como: `GOOGLE_SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT`, `PORT`

### Erro: Permissão negada no Google Sheets
- Verifique se a planilha está compartilhada com a service account
- Confirme que a service account tem permissão de Editor

## 📝 Notas

- O projeto usa `vercel.json` para configurar o build
- Arquivos estáticos são servidos pelo Express com MIME types corretos
- O `.env` não é enviado ao GitHub (protegido pelo `.gitignore`)
- Use `.env.example` como referência para variáveis necessárias
