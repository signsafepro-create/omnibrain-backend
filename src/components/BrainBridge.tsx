import { useState, useCallback } from 'react';

interface BrainProject {
  id: string;
  name: string;
  status: string;
  agents: Agent[];
}

interface Agent {
  id: string;
  agent_name: string;
  status: string;
  task_description: string;
}

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function useBrainBridge() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = useCallback(async (name: string, description: string, projectType: string = 'website') => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/brain/create-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, description, project_type: projectType })
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const buildProject = useCallback(async (projectId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/brain/build/${projectId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return await res.json();
    } finally {
      setLoading(false);
    }
  }, []);

  const listProjects = useCallback(async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API}/api/brain/projects`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  }, []);

  return { createProject, buildProject, listProjects, loading, error };
}
