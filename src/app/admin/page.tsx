import styles from './Dashboard.module.css';

export default function AdminDashboard() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>DASHBOARD OVERVIEW</h1>
        <p>Manage your architectural portfolio content.</p>
      </header>
      
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>PROJECTS</h3>
          <p>Total: 0</p>
        </div>
        <div className={styles.card}>
          <h3>MESSAGES</h3>
          <p>New: 0</p>
        </div>
        <div className={styles.card}>
          <h3>EXPERIENCE</h3>
          <p>Items: 0</p>
        </div>
      </div>
      
      <section className={styles.quickActions}>
        <h2>QUICK ACTIONS</h2>
        <div className={styles.buttonGroup}>
          <button className={styles.primary}>ADD NEW PROJECT</button>
          <button className={styles.secondary}>UPDATE BIO</button>
        </div>
      </section>
    </div>
  );
}
