import { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }
    const timer = setTimeout(async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${API}/api/dashboard/search?q=${encodeURIComponent(query)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch {}
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9998,
      display: 'flex', justifyContent: 'center', paddingTop: '15vh'
    }} onClick={() => setOpen(false)}>
      <div style={{
        width: 600, maxWidth: '90vw', background: '#0f0f0f', border: '1px solid #333',
        borderRadius: 12, overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search projects, websites, campaigns..."
          style={{
            width: '100%', padding: 20, fontSize: 16, background: 'transparent',
            border: 'none', color: '#fff', outline: 'none'
          }}
        />
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          {results.map((r, i) => (
            <div key={i} style={{
              padding: '12px 20px', borderTop: '1px solid #222', color: '#fff',
              cursor: 'pointer'
            }} onClick={() => { window.location.href = r.url; setOpen(false); }}
               onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
               onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ color: '#f97316', fontWeight: 'bold' }}>{r.type}</span>
              <span style={{ marginLeft: 12 }}>{r.name}</span>
            </div>
          ))}
          {query.length >= 2 && results.length === 0 && (
            <p style={{ padding: 20, color: '#555', textAlign: 'center' }}>No results found</p>
          )}
        </div>
      </div>
    </div>
  );
}
