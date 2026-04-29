'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    const { error } = await supabase
      .from('messages')
      .insert([formData]);

    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.group}>
            <label>NAME</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>
          <div className={styles.group}>
            <label>EMAIL</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>
        </div>
        <div className={styles.group}>
          <label>SUBJECT</label>
          <input 
            type="text" 
            value={formData.subject} 
            onChange={e => setFormData({...formData, subject: e.target.value})} 
          />
        </div>
        <div className={styles.group}>
          <label>MESSAGE</label>
          <textarea 
            rows={5} 
            value={formData.message} 
            onChange={e => setFormData({...formData, message: e.target.value})} 
            required 
          />
        </div>
        
        <button type="submit" className={styles.button} disabled={status === 'loading'}>
          {status === 'loading' ? 'TRANSMITTING...' : 'SEND MESSAGE'}
        </button>

        {status === 'success' && <p className={styles.success}>MESSAGE TRANSMITTED SUCCESSFULLY.</p>}
        {status === 'error' && <p className={styles.error}>TRANSMISSION FAILED. PLEASE TRY AGAIN.</p>}
      </form>
    </div>
  );
}
