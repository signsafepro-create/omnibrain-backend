# LIL.JR 2.0 — Integration Guide
## Wiring Go-Live Components into Existing App

### Step 1: Global Overlays (App.tsx)
Add these imports and components to your existing App.tsx:

```tsx
import { CommandPalette } from './components/CommandPalette';
import { Onboarding } from './components/Onboarding';
import { ChatWidget } from './components/ChatWidget';
import { GlobalSearch } from './components/GlobalSearch';

// In your JSX, add these as siblings to your router/layout:
<CommandPalette />
<GlobalSearch />
<Onboarding />
<ChatWidget />
```

### Step 2: Top Bar (Layout.tsx)
Add the notification bell:

```tsx
import { NotificationCenter } from './components/NotificationCenter';

// In your top bar:
<NotificationCenter />
```

### Step 3: Service Worker (main.tsx)
Register for PWA offline support:

```tsx
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.ts')
    .then(r => console.log('SW registered'))
    .catch(e => console.error('SW error', e));
}
```

### Step 4: Brain Page (Brain.tsx)
Replace existing Brain logic with:

```tsx
import { useBrainBridge } from '../components/BrainBridge';
import { FileUpload } from '../components/FileUpload';

const { createProject, buildProject, listProjects } = useBrainBridge();
```

### Step 5: WebSocket (server.js)
Add to your existing server.js after HTTP server creation:

```js
const { createWebSocketServer } = require('./websocket-server');
const wsManager = createWebSocketServer(server);
```

### Step 6: Brain Bridge (router)
Add to your existing routes:

```js
const brainPythonRouter = require('./brain-python-bridge');
app.use('/api/brain-py', brainPythonRouter);
```

### Step 7: Stripe Webhook
Add to your existing routes:

```js
const stripeWebhook = require('./stripe-webhook');
app.use('/webhook', stripeWebhook);
```

### Step 8: PWA Meta Tags (index.html)
Add inside `<head>`:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#f97316" />
```

### Step 9: Environment Variables
Add to .env:

```env
PYTHON_BRAIN_URL=http://localhost:5000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 10: Run Tests
```powershell
node tests/test-runner.js
```
