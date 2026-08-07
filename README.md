# X-SOVEREIGN — Unified IPO Intelligence Terminal

> End-to-end full-stack AI-powered IPO intelligence dashboard with real-time market scanning, OMNIBRAIN chat, Stripe payment integration, and autonomous marketing dispatch.

## Quick Start (Local)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Production Build

```bash
npm run build
RUN_SERVER=true node dist/server.cjs
```

## Deployment

### GitHub Actions → Cloudflare Pages

1. Fork/clone this repo.
2. Add the following secrets in **Settings → Secrets → Actions**:

| Secret | Value |
|--------|-------|
| `CF_API_TOKEN` | Your Cloudflare API token (Pages:Edit) |
| `CF_ACCOUNT_ID` | Your Cloudflare account ID |

3. Push to `main` — the workflow builds and deploys automatically.

### Custom Domain

After the first deployment, go to **Cloudflare Pages → your project → Custom Domains** and add your domain.

## Environment Variables

Copy `.env.example` to `.env` and fill in your keys:

```bash
cp .env.example .env
```

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS 4
- **Backend**: Express + TypeScript (bundled via esbuild)
- **AI**: Google Gemini 2.5 Pro / Flash
- **Payments**: Stripe Checkout + Webhooks
- **Database**: SQLite (better-sqlite3)
- **CI/CD**: GitHub Actions → Cloudflare Pages
