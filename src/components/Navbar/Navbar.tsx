import Link from 'next/link';
import styles from './Navbar.module.css';

interface NavbarProps {
  profileName: string;
}

export default function Navbar({ profileName }: NavbarProps) {
  return (
    <nav className={styles.nav}>
      <div className={`${styles.container} container`}>
        <div className={styles.status}>
          <span className={styles.indicator}></span>
          AVAILABLE FOR PROJECTS / 2026
        </div>
        <Link href="/" className={styles.logo}>
          {profileName.toUpperCase()}
        </Link>
        <ul className={styles.links}>
          <li><Link href="#index">INDEX</Link></li>
          <li><Link href="#discipline">DISCIPLINE</Link></li>
          <li><Link href="#initialize">INITIALIZE</Link></li>
        </ul>
      </div>
    </nav>
  );
}
