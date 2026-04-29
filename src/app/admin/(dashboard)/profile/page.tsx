'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './Profile.module.css';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    bio: '',
    philosophy: '',
    location: '',
    email: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setProfile({
          name: data.name || '',
          title: data.philosophy || '', // Using philosophy as the "SYSTEM ARCHITECT" title for now
          bio: data.bio || '',
          philosophy: data.philosophy || '',
          location: data.email || '', // Reusing fields or I should update schema
          email: data.email || '',
        });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profile')
        .upsert({
          id: user.id,
          name: profile.name,
          bio: profile.bio,
          philosophy: profile.philosophy,
          email: profile.email,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className={styles.loading}>LOADING PROFILE...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>PROFILE MANAGEMENT</h1>
        <p>Edit your personal information and architectural philosophy.</p>
      </header>

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.inputGroup}>
          <label>FULL NAME</label>
          <input 
            type="text" 
            value={profile.name} 
            onChange={e => setProfile({...profile, name: e.target.value})}
            placeholder="e.g. JOHN DOE"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>MAIN TITLE / ROLE</label>
          <input 
            type="text" 
            value={profile.philosophy} 
            onChange={e => setProfile({...profile, philosophy: e.target.value})}
            placeholder="e.g. SYSTEM ARCHITECT"
          />
        </div>

        <div className={styles.inputGroup}>
          <label>BIO / ABOUT</label>
          <textarea 
            value={profile.bio} 
            onChange={e => setProfile({...profile, bio: e.target.value})}
            placeholder="Write your professional bio..."
            rows={5}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>CONTACT EMAIL</label>
          <input 
            type="email" 
            value={profile.email} 
            onChange={e => setProfile({...profile, email: e.target.value})}
            placeholder="admin@example.com"
          />
        </div>

        {message && (
          <div className={message.type === 'success' ? styles.success : styles.error}>
            {message.text}
          </div>
        )}

        <button type="submit" disabled={saving} className={styles.saveButton}>
          {saving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  );
}
