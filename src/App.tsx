import { useEffect } from 'react';
import { CommandPalette } from './components/CommandPalette';
import { Onboarding } from './components/Onboarding';
import { ChatWidget } from './components/ChatWidget';
import { GlobalSearch } from './components/GlobalSearch';
import { NotificationCenter } from './components/NotificationCenter';
import { Layout } from './components/Layout';

function App() {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.ts')
        .then(reg => console.log('SW registered:', reg.scope))
        .catch(err => console.error('SW failed:', err));
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      <Layout>
        {/* Your existing routes/pages go here */}
        <div style={{ padding: 40 }}>
          <h1 style={{ color: '#f97316', fontSize: 32 }}>🔥 LIL.JR 2.0 EMPIRE</h1>
          <p style={{ color: '#888' }}>Command Center is live. All systems operational.</p>
        </div>
      </Layout>

      {/* Global overlays */}
      <CommandPalette />
      <GlobalSearch />
      <Onboarding />
      <ChatWidget />
    </div>
  );
}

export default App;
