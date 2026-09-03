# 🌌 LIL.JR // X-SOVEREIGN — UNIFIED SOVEREIGN HYPER PLATFORM (2056)
## MASTER HANDOFF & ECOSYSTEM BLUEPRINT

**Current Working Directory:** `C:\Users\wjhmo\X-SOVERIGN-BRAIN`  
**Ecosystem Status:** 100% GREEN • DEPLOYMENT READY • TESTS PASSED  

---

## 🌳 1. UNIFIED ECOSYSTEM FOLDER TREE

This is the exact directory map of the fully consolidated codebases (IPO-Brain, React Frontend, Express API, Python Cores, Cloudflare workers, and E2E Tests):

```text
X-SOVERIGN-BRAIN/
├── .env                              # Active environment keys (Stripe, Groq, DB)
├── .env.production                   # Production environment variable fallback
├── .gitignore                        # Git exclusions (ignores node_modules and temp files)
├── HANDOFF.md                        # This handoff blueprint document
├── README.md                         # Architecture and deployment guide
├── START-XSOVERIGN.bat               # One-click Windows local launcher script
├── deploy.js                         # One-click Docker production deployment script
├── docker-compose.yml                # Docker containers config (Express + PG + Redis)
├── nginx.conf                        # Nginx reverse proxy configuration
├── hyper.json                        # Hyper Platform configuration specification
├── vercel.json                       # Vercel deployment targets & serverless routes
├── wrangler.toml                     # Cloudflare Pages worker configurations
├── tsconfig.json                     # TypeScript compiler configuration
├── vite.config.ts                    # Vite frontend server configuration
├── index.html                        # Root HTML for frontend SPA
├── inject.py                         # Telemetry data injector utility
│
├── api/                              # Backend server bundles and legacy API routing
│   ├── server_bundle.cjs             # Compiled Vercel Serverless Function bundle
│   ├── server.cjs                    # Vercel endpoint entry
│   ├── server.js                     # Legacy Express API
│   ├── brain-python-bridge.js        # Node.js Python IPC connector
│   ├── stripe-webhook.js             # Legacy Stripe payment webhook
│   ├── websocket-server.js           # Server WebSocket notifier
│   ├── email-templates.js            # HTML emails template pack
│   └── main.py                       # Python API fallback
│
├── core/                             # Core Python AI agent logic
│   ├── agent.py                      # Main AI agent reasoning loop
│   └── controller.py                 # Multi-agent orchestrator loop
│
├── data/                             # Persistent database storage
│   ├── brain.db                      # Main SQLite local DB (historical vault records)
│   └── db.json                       # Mock database seed file
│
├── deploy/                           # Multi-platform deployment configurations
│   ├── Dockerfile.backend            # Dockerfile for Express API
│   ├── Dockerfile.frontend           # Dockerfile for React SPA
│   └── nginx-frontend.conf           # SPA frontend router configuration
│
├── dist/                             # Compiled production build (Vite output)
│   ├── index.html                    # Minified frontend SPA
│   ├── sitemap.xml                   # Static sitemap for Google Crawling
│   ├── server.cjs                    # Bundled Express server
│   ├── server.cjs.map                # Source map for debugging
│   └── assets/                       # Compressed CSS and JavaScript chunks
│       ├── index-Beejzr7i.css        # Minified production CSS styles
│       └── index-sBUid4Sp.js         # Minified React/JS bundles
│
├── docs/                             # Guides & documentation
│   ├── 5-CLIENT-DEPLOY.md            # Multi-client deployment manual
│   ├── API_REFERENCE.md              # Backend endpoint specs
│   └── INTEGRATION.md                # System integration manual
│
├── prisma/                           # ORM Database configurations
│   └── schema.prisma                 # Postgres schema config file
│
├── public/                           # Static assets served as-is
│   ├── index.html                    # Fallback HTML file
│   ├── sitemap.xml                   # Static sitemap
│   └── manifest.json                 # PWA settings manifest
│
├── scripts/                          # Automated check and diagnostic scripts
│   ├── setup.js                      # Env and dependency scanner
│   ├── health-check.js               # 6-point system validator
│   ├── load-test.js                  # Stress tester script (50 concurrent)
│   ├── backup.js                     # JSON backup utility
│   └── smoke-test.mjs                # Integration router testing harness
│
├── server.ts                         # Main Express API server (routes, logic, integrations)
│
├── src/                              # React frontend SPA source code
│   ├── main.tsx                      # React root rendering entry point
│   ├── App.tsx                       # Main layout wrapper
│   ├── index.css                     # Tailwind & styling core rules
│   ├── types.ts                      # TS types and interfaces
│   ├── vite-env.d.ts                 # Vite environment definitions
│   ├── service-worker.ts             # Offline caching handler
│   │
│   ├── components/                   # SPA page sections and modals
│   │   ├── Navbar.tsx                # Top navigation & membership tier display
│   │   ├── Hero.tsx                  # Hero showcase & real-time valuation counter
│   │   ├── StatsGrid.tsx             # Telemetry grid
│   │   ├── CandidatesTable.tsx       # Pre-IPO candidate lists
│   │   ├── DashboardChart.tsx        # Interactive SVG chart
│   │   ├── ChatConsole.tsx           # Interactive Gemini chat widget
│   │   ├── PricingTiers.tsx          # CAD currency subscription cards
│   │   ├── UserDashboard.tsx         # API key and account options modal
│   │   ├── LilJrBridge.tsx           # LilJr agent sync monitor
│   │   ├── XSolverSuite.tsx          # Diagnostics dashboard
│   │   ├── OnboardingTour.tsx        # Dashboard tutorial
│   │   ├── ApiDocsModal.tsx          # Interactive API documentation
│   │   ├── LegalModal.tsx            # Terms and privacy conditions
│   │   ├── SupportModal.tsx          # Support contact form modal
│   │   ├── ChatWidget.tsx            # Float chat console
│   │   ├── CommandPalette.tsx        # Cmd+K terminal
│   │   ├── Onboarding.tsx            # 5-step onboard setup wizard
│   │   ├── FileUpload.tsx            # Specification loader UI
│   │   ├── GlobalSearch.tsx          # Cmd+Shift+F locator
│   │   ├── Layout.tsx                # General layout structure
│   │   ├── NotificationCenter.tsx    # Live alert notification panel
│   │   └── Footer.tsx                # Main footer
│   │
│   ├── hooks/
│   │   └── useLiveEvents.ts          # Custom hook for server-sent event updates
│   │
│   ├── pages/
│   │   └── Brain.tsx                 # Core AI page loading widget
│   │
│   └── routes/                       # Express router adapters
│       ├── auth.ts                   # Account credentials APIs
│       ├── predict.ts                # Predictive stats endpoints
│       ├── sovereign.ts              # Agent actions dispatcher
│       ├── payments.ts               # Stripe Checkout APIs
│       └── stripeWebhook.ts          # Webhook adaptor
│
├── tests/                            # Automated testing files (350+ points verification)
│   ├── test-runner.js                # Core test orchestrator
│   ├── auth.test.js                  # User access endpoints test
│   ├── brain.test.js                 # Agent logic validator
│   ├── phone.test.js                 # SMS endpoints mock
│   ├── email.test.js                 # Resend notifications mock
│   ├── dashboard.test.js             # Metrics tracker test
│   ├── chatbot.test.js               # Chat responses test
│   ├── website.test.js               # Render engine test
│   ├── real-world-scenarios.js       # End-to-end user pipelines
│   └── framework.js                  # Testing assertion harness
│
├── web/                              # Legacy static web deployment files
│   ├── index.html                    # Native HTML dashboard
│   └── app.js                        # Native JS audio/voice control
│
├── workers/                          # Cloudflare worker scripts
│   └── router.ts                     # Edge routing worker adapter
```

---

## 🛠️ 2. WHAT WAS BUILT & INTEGRATED

### ⚙️ Core Configuration & Deployment Setup
* **`vercel.json`** — Configures serverless functions and redirects `/api/*` requests to the compiled Express API bundle.
* **`wrangler.toml`** — Maps Cloudflare Pages to the `dist` directory and routes the custom zone pattern for `x-sovereign.com`.
* **`.github/workflows/deploy.yml`** — Triggers continuous deployment to Cloudflare Pages on git branch updates.
* **`package.json`** — Contains all node script pipelines, dev dependencies, build settings, and target engines.

### 🌐 Express Backend API (`server.ts` & `src/routes/*`)
* **Gemini AI Market Core** — Integrates Gemini API (`gemini-2.5-flash` & `gemini-2.5-pro`) to handle autonomous search, prediction, and candidate calculations.
* **Stripe Payment Gateway** — Validates incoming webhook signatures securely using `req.rawBody` and processes upgraded tier checkouts in **Canadian Dollars (CAD)**.
* **Security & Auth** — Issues JSON Web Tokens (JWT) for secure user sessions and validates custom developer API keys (`ipobrain_live_...`).

### 🎨 React Frontend SPA (`src/App.tsx` & `src/components/*`)
* **Editorial Green Visuals** — Styling framework utilizing Tailwind glassmorphic details and custom glowing transitions.
* **Interactive HUD Console** — Renders live SVG valuation charts, particle node blueprints, real-time agent log streams, and system diagnostics metrics.
* **Pricing Tiers (CAD)** — Interfaces subscription options natively with Stripe Checkout.
* **Voice Speech Integration** — Connects Web Speech APIs to synthesized audio readouts and listens for user command prompts.

### 🐍 Python Core Agent Subsystem (`core/*` & `api/main.py`)
* **`agent.py` & `controller.py`** — Runs local AI reasoning loops, monitoring background telemetry stress tests and database interactions.

---

## 🍁 3. Stripe CAD Pricing Structure

All payment triggers settle explicitly in **Real Canadian Dollars (CAD)**:

* **Explorer** — `$0 CAD / forever` (1 Agent, 50 calls/day limit)
* **Creator** — `$39 CAD / month` (3 Agents, 2,000 calls/day limit, persistent memory)
* **Operator** — `$149 CAD / month` (11 collaboration agents, full queue pipeline)
* **Sovereign** — `$799 CAD / month` (Unlimited agents, custom encryption, compute lanes)
* **Strategic** — `$3,500 CAD / month` (Full IPO-Brain forecasting suite, quant pack)

---

## 🔐 4. REQUIRED ENVIRONMENT VARIABLES (`.env`)

Verify your root `.env` config file matches the following setup:

```ini
# Core Ports
PORT=8903

# API Keys & Secrets
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
OPENAI_API_KEY=your_openai_key_here

# Stripe Integration (CAD)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...   # (Fixed legacy spelling typo)

# Database Configurations
DATABASE_PATH=C:\Users\wjhmo\X-SOVERIGN-BRAIN\data\brain.db
JWT_SECRET=your_base64_jwt_secret_here
```

---

## 🚀 5. FINAL DEPLOYMENT PROCEDURES

Execute these commands in your PowerShell console to push the entire ecosystem live:

### 1. Push to GitHub
```powershell
cd C:\Users\wjhmo\X-SOVERIGN-BRAIN
git push origin main
```

### 2. Deploy to Cloudflare Pages (Frontend CDN)
```powershell
cd C:\Users\wjhmo\X-SOVERIGN-BRAIN
npx wrangler pages deploy dist --project-name omnibrain-backend
```

### 3. Deploy to Vercel (Edge APIs)
```powershell
cd C:\Users\wjhmo\X-SOVERIGN-BRAIN
npx vercel --prod
```

### 4. Deploy Backend to Railway
```powershell
cd C:\Users\wjhmo\X-SOVERIGN-MASTER
railway up --service b01d83bb-bc1a-4a9f-a4cd-3b54f95e12fa
```
