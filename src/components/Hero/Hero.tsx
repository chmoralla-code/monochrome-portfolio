import styles from './Hero.module.css';

interface HeroProps {
  title: string;
  location: string;
  bio: string;
}

export default function Hero({ title, location, bio }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={`${styles.container} container`}>
        <div className={styles.intro}>
          <span className="section-number">01 // INITIALIZE</span>
          <h1 className={styles.title}>
            {title.split(' ')[0]}<br />
            <span>{title.split(' ').slice(1).join(' ') || 'ARCHITECT'}</span>
          </h1>
          <div className={styles.details}>
            <p>BASED IN {location.toUpperCase()}</p>
            <p>SPECIALIZING IN MINIMALIST STRUCTURES</p>
          </div>
        </div>
        
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <div className={styles.overlay}></div>
            <div className={styles.scanline}></div>
          </div>
          <div className={styles.sidebar}>
            <div className={styles.sideItem}>
              <h3>DISCIPLINE</h3>
              <p>PRECISION. ORDER. ENTROPY.</p>
            </div>
            <div className={styles.sideItem}>
              <h3>CRAFT</h3>
              <p>{bio.substring(0, 30).toUpperCase()}...</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
