import { useState, useEffect, useCallback } from 'react';

const COMMANDS = [
  { id: 'new-project', label: 'New Project', shortcut: '⌘N', action: () => window.location.href = '/brain' },
  { id: 'new-website', label: 'New Website', shortcut: '⌘W', action: () => window.location.href = '/website' },
  { id: 'new-email', label: 'New Email Campaign', shortcut: '⌘E', action: () => window.location.href = '/email' },
  { id: 'dashboard', label: 'Open Dashboard', shortcut: '⌘D', action: () => window.location.href = '/dashboard' },
  { id: 'chatbot', label: 'Open Chatbot', shortcut: '⌘T', action: () => window.location.href = '/chatbot' },
  { id: 'phone', label: 'Send SMS', shortcut: '⌘P', action: () => window.location.href = '/phone' },
  { id: 'profile', label: 'My Profile', shortcut: '⌘U', action: () => window.location.href = '/profile' },
  { id: 'logout', label: 'Logout', shortcut: '⌘L', action: () => { localStorage.removeItem('token'); window.location.href = '/login'; } },
  { id: 'search', label: 'Global Search', shortcut: '⇧⌘F', action: () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', shiftKey: true, metaKey: true })) },
  { id: 'help', label: 'Help Center', shortcut: '?', action: () => window.open('/docs', '_blank') },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(v => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  const run = useCallback((cmd: typeof COMMANDS[0]) => {
    cmd.action();
    setOpen(false);
    setQuery('');
  }, []);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', zIndex: 9999,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh'
    }} onClick={() => setOpen(false)}>
      <div style={{
        width: 600, maxWidth: '90vw', background: '#0f0f0f', border: '1px solid #f97316',
        borderRadius: 12, overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Type a command..."
          style={{
            width: '100%', padding: 20, fontSize: 18, background: 'transparent',
            border: 'none', color: '#fff', outline: 'none'
          }}
        />
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          {filtered.map(cmd => (
            <div key={cmd.id} onClick={() => run(cmd)} style={{
              padding: '12px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between',
              color: '#fff', borderTop: '1px solid #222'
            }} onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
               onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <span>{cmd.label}</span>
              <span style={{ color: '#f97316', fontSize: 12 }}>{cmd.shortcut}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
