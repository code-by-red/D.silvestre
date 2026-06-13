# d.silvestre - Backend Node.js com Google Sheets

## 📁 Estrutura do Projeto

```
homenagem d,silvestre/
├── index.html          # HTML principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript do frontend
├── api/                # Serverless functions da Vercel
│   └── mural.js        # API do mural
├── package.json        # Dependências do Node.js
├── .env                # Variáveis de ambiente (credenciais)
└── .gitignore          # Protege arquivos sensíveis
```

## 🚀 Como Configurar

### 1. Preparar a Planilha Google Sheets

1. Acesse sua planilha Google Sheets
2. Configure os cabeçalhos na **linha 1**:
   - **A1:** `nome`
   - **B1:** `cidade`
   - **C1:** `mensagem`
   - **D1:** `data`
3. Copie o ID da planilha da URL (parte entre `/d/` e `/edit`)
4. Adicione ao arquivo `.env`: `GOOGLE_SHEET_ID=SEU_ID_AQUI`

### 2. Compartilhar Planilha com Service Account

1. No Google Cloud Console, adicione permissão de Editor para o email da sua service account
2. O email está nas credenciais JSON (campo `client_email`)

### 3. Configurar Variáveis de Ambiente na Vercel

1. Acesse seu projeto na Vercel
2. Vá em Settings > Environment Variables
3. Adicione:
   - `GOOGLE_SHEET_ID`: ID da sua planilha
   - `GOOGLE_SERVICE_ACCOUNT`: Credenciais JSON (com `\n` para quebras de linha)

## 🔐 Segurança

✅ **Credenciais protegidas:** As chaves privadas ficam apenas no backend (`.env`)
✅ **Zero exposição:** O frontend não tem acesso às credenciais
✅ **API segura:** Backend faz as chamadas ao Google Sheets

## 📊 API Endpoints

### GET `/api/mural`
Retorna todas as mensagens do mural

### POST `/api/mural`
Adiciona uma nova mensagem
```json
{
  "nome": "Nome",
  "cidade": "Cidade - UF",
  "mensagem": "Mensagem"
}
```

### DELETE `/api/mural`
Limpa todas as mensagens (mantém cabeçalhos)

## 🛠️ Troubleshooting

### Erro: "The API returned an error"
- Verifique se a planilha está compartilhada com a service account
- Confirme que o ID da planilha está correto no `.env`

### Erro: "Cannot connect to backend"
- Verifique se o servidor Node.js está rodando
- Confirme que a porta 3000 não está em uso

### Mural não funciona
- Abra o console do navegador (F12) para ver erros
- Verifique se o backend está respondendo em `http://localhost:3000/api/mural`

## 📝 Notas

- O frontend tem fallback para localStorage se o backend não estiver disponível
- O backend usa a biblioteca `googleapis` para acessar o Google Sheets
- CORS está habilitado para permitir requisições do frontend
