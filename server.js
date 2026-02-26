require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Endpoint correto conforme docs: https://ioproof.com
const IOPROOF_URL   = process.env.IOPROOF_URL   || 'https://ioproof.com/v1/proxy/openai/v1/chat/completions';
const IOPROOF_KEY   = process.env.IOPROOF_KEY   || 'iop_live_88d2d38b58a175eee55a58cd1e721dc5e74fab5c';
const PROVIDER_KEY  = process.env.PROVIDER_KEY  || '';  // sua chave OpenAI (sk-...)
const MODEL         = process.env.MODEL         || 'gpt-3.5-turbo';

app.post('/api/perguntar', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'O campo "prompt" é obrigatório.' });
  }

  try {
    const response = await axios.post(
      IOPROOF_URL,
      {
        model: MODEL,
        messages: [{ role: 'user', content: prompt.trim() }]
      },
      {
        headers: {
          'Content-Type':   'application/json',
          'X-IOProof-Key':  IOPROOF_KEY,
          ...(PROVIDER_KEY ? { 'X-Provider-Key': PROVIDER_KEY } : {})
        },
        timeout: 30000
      }
    );
    res.json(response.data);
  } catch (err) {
    const status  = err.response?.status || 500;
    const message = err.response?.data?.error?.message
                 || err.response?.data?.message
                 || err.message
                 || 'Erro desconhecido';
    console.error(`[${status}] ${message}`);
    res.status(status).json({ error: message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
