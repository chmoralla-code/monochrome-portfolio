'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './Experience.module.css';

interface Experience {
  id: string;
  entity: string;
  role: string;
  duration: string;
  description: string;
  order: number;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExp, setCurrentExp] = useState<Partial<Experience>>({
    entity: '',
    role: '',
    duration: '',
    description: '',
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  async function fetchExperiences() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setExperiences(data || []);
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
        .from('experience')
        .upsert({
          ...currentExp,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setIsEditing(false);
      fetchExperiences();
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return;
    try {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchExperiences();
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>EXPERIENCE & AWARDS</h1>
        <button 
          className={styles.addButton}
          onClick={() => {
            setCurrentExp({ entity: '', role: '', duration: '', description: '' });
            setIsEditing(true);
          }}
        >
          ADD NEW ITEM
        </button>
      </header>

      {isEditing ? (
        <div className={styles.modal}>
          <form onSubmit={handleSave} className={styles.form}>
            <h2>{currentExp.id ? 'EDIT ITEM' : 'NEW ITEM'}</h2>
            <div className={styles.inputGroup}>
              <label>ENTITY (COMPANY / AWARD)</label>
              <input 
                type="text" 
                value={currentExp.entity} 
                onChange={e => setCurrentExp({...currentExp, entity: e.target.value})}
                required
              />
            </div>
            <div className={styles.grid}>
              <div className={styles.inputGroup}>
                <label>ROLE / POSITION</label>
                <input 
                  type="text" 
                  value={currentExp.role || ''} 
                  onChange={e => setCurrentExp({...currentExp, role: e.target.value})}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>DURATION</label>
                <input 
                  type="text" 
                  value={currentExp.duration || ''} 
                  onChange={e => setCurrentExp({...currentExp, duration: e.target.value})}
                  placeholder="e.g. 2022 - 2024"
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>DESCRIPTION</label>
              <textarea 
                value={currentExp.description || ''} 
                onChange={e => setCurrentExp({...currentExp, description: e.target.value})}
                rows={4}
              />
            </div>
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.saveButton}>SAVE</button>
              <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelButton}>CANCEL</button>
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.list}>
          {loading ? (
            <p className={styles.loading}>LOADING...</p>
          ) : experiences.length === 0 ? (
            <p className={styles.empty}>NO ITEMS FOUND.</p>
          ) : (
            <div className={styles.gridList}>
              {experiences.map(exp => (
                <div key={exp.id} className={styles.expCard}>
                  <div className={styles.expInfo}>
                    <h3>{exp.entity}</h3>
                    <p className={styles.role}>{exp.role}</p>
                    <p className={styles.duration}>{exp.duration}</p>
                  </div>
                  <div className={styles.actions}>
                    <button onClick={() => { setCurrentExp(exp); setIsEditing(true); }}>EDIT</button>
                    <button onClick={() => handleDelete(exp.id)} className={styles.deleteBtn}>DELETE</button>
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
