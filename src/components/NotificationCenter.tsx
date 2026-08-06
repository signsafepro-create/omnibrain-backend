import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  time: string;
  read: boolean;
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = new WebSocket(`ws://localhost:3001/ws/notifications?token=${token}`);
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setNotifs(prev => [{
        id: Date.now().toString(),
        title: data.title || 'Update',
        message: data.message,
        type: data.type || 'info',
        time: new Date().toLocaleTimeString(),
        read: false
      }, ...prev].slice(0, 50));
    };
    setWs(socket);
    return () => socket.close();
  }, []);

  const unread = notifs.filter(n => !n.read).length;

  const markRead = (id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        background: 'none', border: 'none', color: '#fff', fontSize: 20,
        cursor: 'pointer', position: 'relative'
      }}>
        🔔
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#f97316', color: '#000', fontSize: 10,
            width: 16, height: 16, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold'
          }}>{unread}</span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 40, width: 360, maxHeight: 500,
          background: '#0a0a0a', border: '1px solid #333', borderRadius: 12,
          overflow: 'hidden', zIndex: 999
        }}>
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid #222',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>Notifications</span>
            <button onClick={markAllRead} style={{
              background: 'none', border: 'none', color: '#f97316',
              cursor: 'pointer', fontSize: 12
            }}>Mark all read</button>
          </div>
          <div style={{ overflow: 'auto', maxHeight: 440 }}>
            {notifs.length === 0 && (
              <p style={{ padding: 20, textAlign: 'center', color: '#555' }}>No notifications yet</p>
            )}
            {notifs.map(n => (
              <div key={n.id} onClick={() => markRead(n.id)} style={{
                padding: '12px 16px', borderBottom: '1px solid #1a1a1a',
                background: n.read ? 'transparent' : 'rgba(249,115,22,0.05)',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{
                    color: n.type === 'error' ? '#ef4444' : n.type === 'success' ? '#22c55e' : '#f97316',
                    fontSize: 12, fontWeight: 'bold'
                  }}>{n.type.toUpperCase()}</span>
                  <span style={{ color: '#555', fontSize: 11 }}>{n.time}</span>
                </div>
                <p style={{ color: '#fff', fontSize: 13, margin: 0 }}>{n.title}</p>
                <p style={{ color: '#888', fontSize: 12, margin: '4px 0 0' }}>{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
