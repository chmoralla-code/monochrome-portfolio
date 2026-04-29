'use client';

import { useState, useEffect } from 'react';
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
    thumbnail_url: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);


  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      
      const data = await response.json();
      setProjects(data || []);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }


  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    
    try {
      let thumbnailUrl = currentProject.thumbnail_url || '';

      // Upload image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);
        
        const uploadResponse = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        thumbnailUrl = uploadData.url;
      }

      const isUpdate = !!currentProject.id;
      const projectData = {
        ...currentProject,
        thumbnail_url: thumbnailUrl,
      };

      const response = await fetch('/api/admin/projects', {
        method: isUpdate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save project');
      }

      setSelectedImage(null);
      setIsEditing(false);
      fetchProjects();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }



  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const response = await fetch(`/api/admin/projects?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }

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
              setCurrentProject({ title: '', description: '', location: '', year: new Date().getFullYear(), category: '', thumbnail_url: '' });
              setSelectedImage(null);
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
            <div className={styles.inputGroup}>
              <label>PROJECT IMAGE</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0] || null;
                  setSelectedImage(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setCurrentProject({...currentProject, thumbnail_url: event.target?.result as string});
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {currentProject.thumbnail_url && (
                <div className={styles.imagePreview}>
                  <img src={currentProject.thumbnail_url} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover', marginTop: '10px', border: '1px solid var(--gray-200)' }} />
                </div>
              )}
            </div>
            <div className={styles.buttonGroup}>

              <button type="submit" className={styles.saveButton} disabled={uploading}>
                {uploading ? 'SAVING...' : 'SAVE PROJECT'}
              </button>

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
