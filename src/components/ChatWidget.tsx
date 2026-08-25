import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  time: string;
}

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', text: 'Hey! I\'m LIL.JR. What are we building today?', sender: 'bot', time: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/chatbot/1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: data.response || 'I\'m processing that...',
        sender: 'bot',
        time: new Date().toLocaleTimeString()
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Connection error. Try again.',
        sender: 'bot',
        time: new Date().toLocaleTimeString()
      }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9997 }}>
      {open && (
        <div style={{
          width: 360, height: 500, background: '#0a0a0a', border: '1px solid #333',
          borderRadius: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden',
          marginBottom: 12, boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}>
          <div style={{
            padding: '16px 20px', background: '#f97316', color: '#000',
            fontWeight: 'bold', display: 'flex', justifyContent: 'space-between'
          }}>
            <span>🔥 Talk Engine</span>
            <button onClick={() => setOpen(false)} style={{
              background: 'none', border: 'none', color: '#000', cursor: 'pointer', fontSize: 18
            }}>×</button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
            {messages.map(m => (
              <div key={m.id} style={{
                marginBottom: 12, textAlign: m.sender === 'user' ? 'right' : 'left'
              }}>
                <div style={{
                  display: 'inline-block', padding: '10px 14px', borderRadius: 12,
                  maxWidth: '80%', fontSize: 13, lineHeight: 1.4,
                  background: m.sender === 'user' ? '#f97316' : '#1a1a1a',
                  color: m.sender === 'user' ? '#000' : '#fff'
                }}>
                  {m.text}
                </div>
                <div style={{ fontSize: 10, color: '#555', marginTop: 4 }}>{m.time}</div>
              </div>
            ))}
            {typing && <div style={{ color: '#f97316', fontSize: 12 }}>Typing...</div>}
            <div ref={bottomRef} />
          </div>
          <div style={{ padding: 12, borderTop: '1px solid #222', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything..."
              style={{
                flex: 1, padding: 10, background: '#1a1a1a', border: '1px solid #333',
                borderRadius: 8, color: '#fff', outline: 'none'
              }}
            />
            <button onClick={send} style={{
              padding: '10px 16px', background: '#f97316', color: '#000',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold'
            }}>Send</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)} style={{
        width: 56, height: 56, borderRadius: '50%', background: '#f97316',
        border: 'none', color: '#000', fontSize: 24, cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(249,115,22,0.4)', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      }}>💬</button>
    </div>
  );
}
