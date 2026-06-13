# Configuracao para Vercel

## Estrutura do Projeto

```
homenagem d,silvestre/
├── index.html          # HTML principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript do frontend
├── server.js           # Backend Node.js (API)
├── package.json        # Dependencias
├── .env                # Variaveis de ambiente (nao enviado ao GitHub)
└── .env.example        # Exemplo de variaveis de ambiente
```

## Deploy na Vercel

### 1. Configurar Variaveis de Ambiente na Vercel

1. Acesse seu projeto na Vercel: https://vercel.com/dashboard
2. Va em Settings > Environment Variables
3. Adicione as seguintes variaveis:

#### GOOGLE_SHEET_ID
- ID da sua planilha Google Sheets

#### GOOGLE_SERVICE_ACCOUNT
- Credenciais JSON completa da Google Service Account
- Copie todo o conteudo JSON do arquivo de credenciais
- IMPORTANTE: Use aspas duplas e escape as quebras de linha com \n

Exemplo de como formatar:
```
{"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCgApFg0Q0a7wGJ\n...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"...","universe_domain":"googleapis.com"}
```

#### PORT
- Valor: 3000

### 2. Redeploy

Apos configurar as variaveis de ambiente:
1. Va em Deployments no dashboard da Vercel
2. Clique no botao ... (tres pontos) no deploy mais recente
3. Selecione Redeploy

### 3. Compartilhar Planilha com Service Account

1. No Google Cloud Console, encontre o email da service account (campo client_email nas credenciais)
2. Acesse sua planilha Google Sheets
3. Clique em Compartilhar
4. Adicione o email da service account como Editor

### 4. Configurar Cabecalhos da Planilha

Na planilha Google Sheets, configure os cabecalhos na linha 1:
- A1: nome
- B1: cidade
- C1: mensagem
- D1: data

## Solucao de Problemas

### Erro: MIME type 'text/html' para CSS/JS
- Isso foi corrigido no server.js com configuracao de MIME types
- Faca um redeploy apos atualizar o codigo

### Erro: submitComment is not defined
- Verifique se o script.js esta sendo carregado corretamente
- Abra o console do navegador (F12) para ver erros

### Erro: Variaveis de ambiente nao funcionando
- Verifique se as variaveis estao configuradas na Vercel
- Confirme que os nomes estao exatamente como: GOOGLE_SHEET_ID, GOOGLE_SERVICE_ACCOUNT, PORT

### Erro: Permissao negada no Google Sheets
- Verifique se a planilha esta compartilhada com a service account
- Confirme que a service account tem permissao de Editor

## Notas

- O projeto usa deteccao automatica da Vercel para Node.js
- Arquivos estaticos sao servidos pelo Express
- O .env nao e enviado ao GitHub (protegido pelo .gitignore)
- Use .env.example como referencia para variaveis necessarias
