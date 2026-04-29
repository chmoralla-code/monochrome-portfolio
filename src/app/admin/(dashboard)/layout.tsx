import Link from 'next/link';
import styles from './AdminLayout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminWrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Link href="/admin">ADMIN PANEL</Link>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin">DASHBOARD</Link>
          <Link href="/admin/profile">PROFILE</Link>
          <Link href="/admin/projects">PROJECTS</Link>
          <Link href="/admin/experience">EXPERIENCE</Link>
          <Link href="/admin/messages">MESSAGES</Link>
          <div className={styles.spacer}></div>
          <Link href="/" className={styles.viewSite}>VIEW SITE</Link>
        </nav>
      </aside>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
