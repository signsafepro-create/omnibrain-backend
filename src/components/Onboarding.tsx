import { useState, useEffect } from 'react';

const STEPS = [
  { title: 'Welcome to LIL.JR 2.0', desc: 'Your AI Empire Command Center. 7 systems. One screen. Total control.' },
  { title: 'Make It Real', desc: 'Describe your idea. 11 AI agents build it. Website. App. Marketing. In less than a minute.' },
  { title: 'One-Second Site', desc: 'AI website designer. Type your business. Get a live site. Built in one. Live in seconds.' },
  { title: 'Signal Fire', desc: 'Email campaigns that convert. Reach them. Own the inbox. Track every open and click.' },
  { title: 'Direct Line', desc: 'Text them. Call them. Close them. Your AI phone system works 24/7.' },
];

export function Onboarding() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = localStorage.getItem('liljr_onboarding_seen');
    if (!seen) setShow(true);
  }, []);

  if (!show) return null;

  const finish = () => {
    localStorage.setItem('liljr_onboarding_seen', 'true');
    setShow(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        width: 500, maxWidth: '90vw', background: '#0a0a0a', border: '2px solid #f97316',
        borderRadius: 16, padding: 40, textAlign: 'center', color: '#fff'
      }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>🔥</div>
        <h2 style={{ color: '#f97316', marginBottom: 16 }}>{STEPS[step].title}</h2>
        <p style={{ color: '#aaa', lineHeight: 1.6, marginBottom: 30 }}>{STEPS[step].desc}</p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              background: i === step ? '#f97316' : '#333'
            }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              padding: '10px 24px', background: '#222', color: '#fff', border: 'none',
              borderRadius: 8, cursor: 'pointer'
            }}>Back</button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} style={{
              padding: '10px 24px', background: '#f97316', color: '#000', border: 'none',
              borderRadius: 8, cursor: 'pointer', fontWeight: 'bold'
            }}>Next</button>
          ) : (
            <button onClick={finish} style={{
              padding: '10px 24px', background: '#f97316', color: '#000', border: 'none',
              borderRadius: 8, cursor: 'pointer', fontWeight: 'bold'
            }}>Launch Empire</button>
          )}
          <button onClick={finish} style={{
            padding: '10px 24px', background: 'transparent', color: '#666', border: '1px solid #333',
            borderRadius: 8, cursor: 'pointer'
          }}>Skip</button>
        </div>
      </div>
    </div>
  );
}
