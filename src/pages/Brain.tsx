import { useState } from 'react';
import { useBrainBridge } from '../components/BrainBridge';
import { FileUpload } from '../components/FileUpload';

export function BrainPage() {
  const { createProject, buildProject, listProjects, loading, error } = useBrainBridge();
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const handleCreate = async () => {
    const result = await createProject(name, desc);
    setProjects(prev => [...prev, result.project]);
    setName('');
    setDesc('');
  };

  const handleUpload = (file: File, text: string) => {
    // Parse uploaded file as project spec
    createProject(file.name.replace(/\.[^/.]+$/, ''), text.substring(0, 500));
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ color: '#f97316', marginBottom: 8 }}>🧠 Make It Real</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>11 AI agents. Your idea. Reality. In less than a minute.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: '#fff', marginBottom: 16 }}>Describe Your Idea</h3>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Project name..."
            style={{
              width: '100%', padding: 12, marginBottom: 12, background: '#1a1a1a',
              border: '1px solid #333', borderRadius: 8, color: '#fff'
            }}
          />
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Describe what you want to build..."
            rows={4}
            style={{
              width: '100%', padding: 12, marginBottom: 16, background: '#1a1a1a',
              border: '1px solid #333', borderRadius: 8, color: '#fff', resize: 'vertical'
            }}
          />
          <button
            onClick={handleCreate}
            disabled={loading || !name}
            style={{
              width: '100%', padding: 14, background: loading ? '#333' : '#f97316',
              color: '#000', border: 'none', borderRadius: 8, cursor: 'pointer',
              fontWeight: 'bold', fontSize: 16
            }}
          >
            {loading ? 'Initializing 11 Agents...' : '🔥 MAKE IT REAL'}
          </button>
          {error && <p style={{ color: '#ef4444', marginTop: 12 }}>{error}</p>}
        </div>

        <div>
          <h3 style={{ color: '#fff', marginBottom: 16 }}>Or Upload a Spec</h3>
          <FileUpload onUpload={handleUpload} accept=".txt,.md,.pdf" />
        </div>
      </div>

      <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 12, padding: 24 }}>
        <h3 style={{ color: '#fff', marginBottom: 16 }}>Your Projects</h3>
        {projects.length === 0 && <p style={{ color: '#555' }}>No projects yet. Create one above.</p>}
        {projects.map(p => (
          <div key={p.id} style={{
            padding: 16, borderBottom: '1px solid #1a1a1a', display: 'flex',
            justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 'bold' }}>{p.name}</p>
              <p style={{ color: '#888', fontSize: 12 }}>{p.status} • {p.agent_count || 0} agents</p>
            </div>
            <button
              onClick={() => buildProject(p.id)}
              style={{
                padding: '8px 16px', background: '#f97316', color: '#000',
                border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              Build
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
