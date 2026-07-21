# AMX Conversions API Worker

Worker separado da AMX para receber eventos do site e encaminhar para a Meta Conversions API.

## Configuracao

As configuracoes publicas ficam em `wrangler.jsonc`. O token da Meta deve ser salvo somente como secret do Cloudflare:

```bash
npm run worker:amx:secret
```

## Deploy

```bash
npm run worker:amx:deploy
```

Depois do deploy, use a URL publica do Worker com `/events` na variavel `VITE_META_CAPI_URL` do GitHub.
