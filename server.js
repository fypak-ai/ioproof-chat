require('dotenv').config();
const express = require('express');
const axios   = require('axios');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Provider: 'groq' ou 'openai' (via IOProof)
const PROVIDER      = (process.env.PROVIDER || 'groq').toLowerCase();

// --- Groq config ---
const GROQ_API_KEY  = process.env.GROQ_API_KEY  || '';
const GROQ_URL      = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL    = process.env.MODEL || 'llama-3.3-70b-versatile';

// --- IOProof/OpenAI config ---
const IOPROOF_URL   = process.env.IOPROOF_URL   || 'https://ioproof.com/v1/proxy/openai/v1/chat/completions';
const IOPROOF_KEY   = process.env.IOPROOF_KEY   || '';
const PROVIDER_KEY  = process.env.PROVIDER_KEY  || '';
const OPENAI_MODEL  = process.env.MODEL         || 'gpt-3.5-turbo';

app.post('/api/perguntar', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'O campo "prompt" e obrigatorio.' });
  }

  try {
    let response;

    if (PROVIDER === 'groq') {
      if (!GROQ_API_KEY) {
        return res.status(500).json({ error: 'GROQ_API_KEY nao definida nas variaveis de ambiente.' });
      }
      response = await axios.post(
        GROQ_URL,
        { model: GROQ_MODEL, messages: [{ role: 'user', content: prompt.trim() }] },
        {
          headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
          },
          timeout: 30000
        }
      );
    } else {
      // openai via IOProof
      if (!IOPROOF_KEY) {
        return res.status(500).json({ error: 'IOPROOF_KEY nao definida nas variaveis de ambiente.' });
      }
      response = await axios.post(
        IOPROOF_URL,
        { model: OPENAI_MODEL, messages: [{ role: 'user', content: prompt.trim() }] },
        {
          headers: {
            'Content-Type':  'application/json',
            'X-IOProof-Key': IOPROOF_KEY,
            ...(PROVIDER_KEY ? { 'X-Provider-Key': PROVIDER_KEY } : {})
          },
          timeout: 30000
        }
      );
    }

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
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT} [provider: ${PROVIDER}]`));
