'use client';

import { useState, useEffect } from 'react';
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
      const response = await fetch('/api/admin/messages');
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      setMessages(data || []);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }


  async function markAsRead(id: string) {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_read: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to mark as read');
      }

      fetchMessages();
    } catch (error: any) {
      alert(error.message);
    }
  }


  async function deleteMessage(id: string) {
    if (!confirm('Delete this message?')) return;
    try {
      const response = await fetch(`/api/admin/messages?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete message');
      }

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
