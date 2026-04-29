import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={`${styles.container} container`}>
        <Link href="/" className={styles.logo}>
          ARCH.STUDIO
        </Link>
        <ul className={styles.links}>
          <li><Link href="/projects">PROJECTS</Link></li>
          <li><Link href="/about">ABOUT</Link></li>
          <li><Link href="/contact">CONTACT</Link></li>
        </ul>
      </div>
    </nav>
  );
}
