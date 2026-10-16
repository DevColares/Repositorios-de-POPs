import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { getProcessosFromNotion, getProcessContent } from './notion-service';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve o frontend (index.html e assets estáticos) na raiz do projeto
app.use(express.static(path.join(__dirname, '..')));

// Rotas da API
app.get('/api/sops', async (req, res) => {
  try {
    const sops = await getProcessosFromNotion();
    res.json(sops);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados do Notion' });
  }
});

app.get('/api/sops/:id/content', async (req, res) => {
  try {
    const id = req.params.id;
    const content = await getProcessContent(id);
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar conteúdo da página' });
  }
});

// Fallback: qualquer rota não reconhecida serve o index.html (Express 5 syntax)
app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
