'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './Messages.module.css';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      fetchMessages();
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm('Delete this message?')) return;
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchMessages();
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>INQUIRIES</h1>
        <p>Manage messages from your contact form.</p>
      </header>

      <div className={styles.list}>
        {loading ? (
          <p className={styles.loading}>LOADING MESSAGES...</p>
        ) : messages.length === 0 ? (
          <p className={styles.empty}>NO MESSAGES RECEIVED YET.</p>
        ) : (
          <div className={styles.messageList}>
            {messages.map(msg => (
              <div key={msg.id} className={`${styles.messageCard} ${msg.is_read ? '' : styles.unread}`}>
                <div className={styles.messageHeader}>
                  <div>
                    <h3>{msg.name}</h3>
                    <p className={styles.email}>{msg.email}</p>
                  </div>
                  <span className={styles.date}>
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.messageBody}>
                  <p className={styles.subject}>SUBJECT: {msg.subject || 'N/A'}</p>
                  <p className={styles.content}>{msg.message}</p>
                </div>
                <div className={styles.actions}>
                  {!msg.is_read && (
                    <button onClick={() => markAsRead(msg.id)} className={styles.readBtn}>MARK AS READ</button>
                  )}
                  <button onClick={() => deleteMessage(msg.id)} className={styles.deleteBtn}>DELETE</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
