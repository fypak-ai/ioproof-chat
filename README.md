# ioproof-chat

Chat IA usando o proxy [IOProof](https://ioproof.com) — Node.js/Express no backend + HTML/JS puro no frontend.

## Estrutura

```
ioproof-chat/
├── server.js        # Backend Express (proxy para IOProof)
├── public/
│   └── index.html   # Frontend (form + chat UI)
├── .env.example     # Template de variáveis de ambiente
├── package.json
└── .gitignore
```

## Configuração

```bash
# 1. Clone e instale dependências
git clone https://github.com/fypak-ai/ioproof-chat.git
cd ioproof-chat
npm install

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite .env e adicione sua IOPROOF_KEY

# 3. Inicie o servidor
npm start
# Ou em modo dev (com auto-reload):
npm run dev
```

Acesse `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `IOPROOF_KEY` | ✅ | Chave da API IOProof |
| `IOPROOF_URL` | ❌ | Endpoint do proxy (padrão: OpenAI) |
| `MODEL` | ❌ | Modelo de IA (padrão: `gpt-3.5-turbo`) |
| `PORT` | ❌ | Porta do servidor (padrão: `3000`) |

## Deploy no Railway

1. Conecte o repositório no [Railway](https://railway.app)
2. Defina a variável `IOPROOF_KEY` em **Settings → Variables**
3. Railway detecta automaticamente o `package.json` e usa `npm start`

## Segurança

- A `IOPROOF_KEY` fica **somente no backend** — nunca exposta ao browser.
- O arquivo `.env` está no `.gitignore`.
