'use client';

import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    experience: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        setStats({
          projects: data.projects || 0,
          messages: data.unreadMessages || 0,
          experience: data.experience || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>DASHBOARD OVERVIEW</h1>
        <p>Manage your architectural portfolio content.</p>
      </header>
      
      <div className={styles.grid}>
        <Link href="/admin/projects" className={styles.card}>
          <h3>PROJECTS</h3>
          <p>{loading ? '...' : stats.projects}</p>
        </Link>
        <Link href="/admin/messages" className={styles.card}>
          <h3>NEW MESSAGES</h3>
          <p>{loading ? '...' : stats.messages}</p>
        </Link>
        <Link href="/admin/experience" className={styles.card}>
          <h3>EXPERIENCE</h3>
          <p>{loading ? '...' : stats.experience}</p>
        </Link>
      </div>
      
      <section className={styles.quickActions}>
        <h2>QUICK ACTIONS</h2>
        <div className={styles.buttonGroup}>
          <Link href="/admin/projects" className={styles.primary}>MANAGE PROJECTS</Link>
          <Link href="/admin/profile" className={styles.secondary}>UPDATE PROFILE</Link>
        </div>
      </section>
    </div>
  );
}
