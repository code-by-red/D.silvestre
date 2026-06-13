const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Configuração do Google Sheets
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = "Mural";

// Autenticação com Google Service Account
const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

// API Endpoints

// GET - Buscar mensagens do mural
app.get('/api/mural', async (req, res) => {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A:D`,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return res.json({ messages: [] });
        }

        // Converter para array de objetos
        const headers = rows[0];
        const messages = rows.slice(1).map(row => ({
            name: row[0] || '',
            city: row[1] || '',
            msg: row[2] || '',
            date: row[3] || ''
        }));

        // Inverter para mostrar mais recentes primeiro
        messages.reverse();

        res.json({ messages });
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
});

// POST - Adicionar nova mensagem
app.post('/api/mural', async (req, res) => {
    try {
        const { nome, cidade, mensagem } = req.body;

        if (!nome || !cidade || !mensagem) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }

        // Formatar data
        const now = new Date();
        const dataFormatada = now.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Adicionar à planilha
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A:D`,
            valueInputOption: 'RAW',
            requestBody: {
                values: [[nome, cidade, mensagem, dataFormatada]]
            }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao adicionar mensagem:', error);
        res.status(500).json({ error: 'Erro ao adicionar mensagem' });
    }
});

// DELETE - Limpar todas as mensagens (mantendo cabeçalhos)
app.delete('/api/mural', async (req, res) => {
    try {
        // Buscar cabeçalhos atuais
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A1:D1`,
        });

        const headers = response.data.values || [['nome', 'cidade', 'mensagem', 'data']];

        // Limpar a planilha e restaurar cabeçalhos
        await sheets.spreadsheets.values.clear({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A:D`,
        });

        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `${SHEET_NAME}!A1:D1`,
            valueInputOption: 'RAW',
            requestBody: {
                values: headers
            }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao limpar mural:', error);
        res.status(500).json({ error: 'Erro ao limpar mural' });
    }
});

// Servir arquivos estáticos
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Planilha Google Sheets: ${SHEET_ID}`);
});
