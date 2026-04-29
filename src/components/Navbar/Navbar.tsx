import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={`${styles.container} container`}>
        <div className={styles.status}>
          <span className={styles.indicator}></span>
          AVAILABLE FOR PROJECTS / 2026
        </div>
        <Link href="/" className={styles.logo}>
          ARCH.STUDIO
        </Link>
        <ul className={styles.links}>
          <li><Link href="/projects">INDEX</Link></li>
          <li><Link href="/about">DISCIPLINE</Link></li>
          <li><Link href="/contact">INITIALIZE</Link></li>
        </ul>
      </div>
    </nav>
  );
}
