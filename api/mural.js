import { google } from 'googleapis';

// Configuração do Google Sheets
const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = "Mural";

// Autenticação com Google Service Account
const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

export default async function handler(req, res) {
    // Habilitar CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method === 'GET') {
        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SHEET_ID,
                range: `${SHEET_NAME}!A:D`,
            });

            const rows = response.data.values;
            if (!rows || rows.length === 0) {
                return res.json({ messages: [] });
            }

            const messages = rows.slice(1).map(row => ({
                name: row[0] || '',
                city: row[1] || '',
                msg: row[2] || '',
                date: row[3] || ''
            }));

            messages.reverse();
            res.json({ messages });
        } catch (error) {
            console.error('Erro ao buscar mensagens:', error);
            res.status(500).json({ error: 'Erro ao buscar mensagens' });
        }
    } else if (req.method === 'POST') {
        try {
            const { nome, cidade, mensagem } = req.body;

            if (!nome || !cidade || !mensagem) {
                return res.status(400).json({ error: 'Campos obrigatórios faltando' });
            }

            const now = new Date();
            const dataFormatada = now.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

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
    } else if (req.method === 'DELETE') {
        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: SHEET_ID,
                range: `${SHEET_NAME}!A1:D1`,
            });

            const headers = response.data.values || [['nome', 'cidade', 'mensagem', 'data']];

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
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
