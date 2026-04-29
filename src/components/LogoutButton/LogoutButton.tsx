'use client';

import { useRouter } from 'next/navigation';
import styles from './LogoutButton.module.css';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button onClick={handleLogout} className={styles.logoutButton}>
      LOGOUT
    </button>
  );
}
