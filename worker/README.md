# Dev Portal Chat Worker

Cloudflare Worker that backs the `/chat` page on the Dev Portal site.
Talks to a Claude model using Will's [digital twin spec](https://github.com/wangyuewwl/Digital-Twin) as the system prompt.

## Status

**Currently shipped as `LLM_PROVIDER=mock`** — the Worker isn't deployed yet, and the React app calls a stub locally. When access lands, deploy the Worker and switch the provider.

See [`Research/genos-backlog.md`](../Research/genos-backlog.md) for the full un-park plan.

## Files

- `src/index.ts` — the Worker
- `wrangler.toml` — config (vars + compatibility date)
- `package.json` — wrangler tooling

## Provider switch

`wrangler.toml` → `LLM_PROVIDER`:

| Value | Behavior | Required secrets |
|---|---|---|
| `mock` (default) | Returns a placeholder reply locally | none |
| `anthropic` | Direct Anthropic API call | `ANTHROPIC_API_KEY` |
| `genos` | Intuit GenOS / Bedrock gateway | `GENOS_ENDPOINT`, `GENOS_AUTH_TOKEN` |

## Deploy (when ready)

1. Install Cloudflare CLI and log in:
   ```bash
   cd worker
   npm install
   npx wrangler login
   ```
2. Set whichever secrets the chosen provider needs:
   ```bash
   # for the genos path:
   npx wrangler secret put GENOS_ENDPOINT
   npx wrangler secret put GENOS_AUTH_TOKEN

   # or for the anthropic path:
   npx wrangler secret put ANTHROPIC_API_KEY
   ```
3. Edit `wrangler.toml` → set `LLM_PROVIDER` to `genos` or `anthropic`.
4. Deploy:
   ```bash
   npm run deploy
   ```
   Wrangler prints the Worker URL — copy it.
5. In the React app, set `VITE_CHAT_API_URL` to the Worker URL (in `app/.env.production` or via the GitHub Pages workflow).
6. Push to redeploy the site. Done.

## Local dev

```bash
cd worker
npm install
npx wrangler dev   # runs at http://127.0.0.1:8787
```

## Endpoints

- `GET /` — health check, returns `{ status, provider, model }`
- `POST /` — chat completion. Body: `{ messages: [{ role: "user" | "assistant", content: string }] }`. Returns `{ reply: string }`.

## CORS

The Worker only allows requests from `ALLOWED_ORIGIN` (set in `wrangler.toml`). Update if the site moves to a custom domain.
