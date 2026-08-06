import { useState, useCallback } from 'react';

export function FileUpload({ onUpload, accept = '*', maxSize = 10 * 1024 * 1024 }: {
  onUpload: (file: File, text: string) => void;
  accept?: string;
  maxSize?: number;
}) {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.size <= maxSize) {
      setFile(dropped);
      readFile(dropped);
    }
  }, [maxSize, onUpload]);

  const readFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      onUpload(f, text);
    };
    reader.readAsText(f);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${drag ? '#f97316' : '#333'}`,
        borderRadius: 12, padding: 40, textAlign: 'center',
        background: drag ? 'rgba(249,115,22,0.1)' : '#0a0a0a',
        color: '#888', cursor: 'pointer', transition: 'all 0.2s'
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>📁</div>
      <p>Drop your file here or click to browse</p>
      <p style={{ fontSize: 12, color: '#555' }}>Max {Math.round(maxSize / 1024 / 1024)}MB</p>
      <input
        type="file"
        accept={accept}
        onChange={e => {
          const f = e.target.files?.[0];
          if (f && f.size <= maxSize) { setFile(f); readFile(f); }
        }}
        style={{ display: 'none' }}
        id="file-input"
      />
      <label htmlFor="file-input" style={{
        display: 'inline-block', marginTop: 16, padding: '8px 20px',
        background: '#f97316', color: '#000', borderRadius: 6,
        cursor: 'pointer', fontWeight: 'bold'
      }}>Browse</label>
      {file && <p style={{ marginTop: 12, color: '#f97316' }}>✓ {file.name}</p>}
    </div>
  );
}
