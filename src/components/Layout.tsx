import { ReactNode } from 'react';
import { NotificationCenter } from './NotificationCenter';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Top Navigation Bar */}
      <nav style={{
        height: 64, background: '#0f0f0f', borderBottom: '1px solid #1a1a1a',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🔥</span>
          <span style={{ color: '#f97316', fontWeight: 'bold', fontSize: 18 }}>LIL.JR 2.0</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#555', fontSize: 12 }}>Empire Command Center</span>
          <NotificationCenter />
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: '#f97316',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#000', fontWeight: 'bold', fontSize: 14, cursor: 'pointer'
          }}>CC</div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: 24 }}>
        {children}
      </main>
    </div>
  );
}
