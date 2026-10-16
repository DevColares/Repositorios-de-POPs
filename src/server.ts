import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getProcessosFromNotion, getProcessContent } from './notion-service';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota para buscar os POPs/SOPs do Notion
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

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
