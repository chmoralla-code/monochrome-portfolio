'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './Projects.module.css';

interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  year: number;
  category: string;
  thumbnail_url: string;
  order: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    location: '',
    year: new Date().getFullYear(),
    category: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('projects')
        .upsert({
          ...currentProject,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setIsEditing(false);
      fetchProjects();
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProjects();
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>PROJECT MANAGEMENT</h1>
        <button 
          className={styles.addButton}
          onClick={() => {
            setCurrentProject({ title: '', description: '', location: '', year: new Date().getFullYear(), category: '' });
            setIsEditing(true);
          }}
        >
          ADD NEW PROJECT
        </button>
      </header>

      {isEditing ? (
        <div className={styles.modal}>
          <form onSubmit={handleSave} className={styles.form}>
            <h2>{currentProject.id ? 'EDIT PROJECT' : 'NEW PROJECT'}</h2>
            <div className={styles.inputGroup}>
              <label>TITLE</label>
              <input 
                type="text" 
                value={currentProject.title} 
                onChange={e => setCurrentProject({...currentProject, title: e.target.value})}
                required
              />
            </div>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label>LOCATION</label>
                <input 
                  type="text" 
                  value={currentProject.location || ''} 
                  onChange={e => setCurrentProject({...currentProject, location: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>YEAR</label>
                <input 
                  type="number" 
                  value={currentProject.year || ''} 
                  onChange={e => setCurrentProject({...currentProject, year: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>CATEGORY</label>
              <input 
                type="text" 
                value={currentProject.category || ''} 
                onChange={e => setCurrentProject({...currentProject, category: e.target.value})}
                placeholder="e.g. RESIDENTIAL, COMMERCIAL"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>DESCRIPTION</label>
              <textarea 
                value={currentProject.description || ''} 
                onChange={e => setCurrentProject({...currentProject, description: e.target.value})}
                rows={5}
              />
            </div>
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.saveButton}>SAVE PROJECT</button>
              <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelButton}>CANCEL</button>
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.list}>
          {loading ? (
            <p className={styles.loading}>LOADING PROJECTS...</p>
          ) : projects.length === 0 ? (
            <p className={styles.empty}>NO PROJECTS FOUND. ADD YOUR FIRST WORK.</p>
          ) : (
            <div className={styles.gridList}>
              {projects.map(project => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.projectInfo}>
                    <h3>{project.title}</h3>
                    <p>{project.category} / {project.year}</p>
                  </div>
                  <div className={styles.projectActions}>
                    <button onClick={() => { setCurrentProject(project); setIsEditing(true); }}>EDIT</button>
                    <button onClick={() => handleDelete(project.id)} className={styles.deleteBtn}>DELETE</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
