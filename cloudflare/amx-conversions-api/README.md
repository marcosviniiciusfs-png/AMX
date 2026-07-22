# AMX Conversions API Worker

Worker separado da AMX para receber eventos do site e encaminhar para a Meta Conversions API.

## Configuracao

As configuracoes publicas ficam em `wrangler.jsonc`. O token da Meta e o webhook de destino devem ser salvos somente como secrets do Cloudflare:

```bash
npm run worker:amx:secret
wrangler secret put LEAD_DESTINATION_WEBHOOK_URL --config cloudflare/amx-conversions-api/wrangler.jsonc
```

## Deploy

```bash
npm run worker:amx:deploy
```

Depois do deploy, use a URL publica do Worker com `/events` na variavel `VITE_META_CAPI_URL` do GitHub.
