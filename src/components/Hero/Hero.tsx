import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`${styles.container} container`}>
        <h1 className={styles.title}>
          SHAPING THE<br />
          <span>FUTURE OF SPACE</span>
        </h1>
        <div className={styles.imagePlaceholder}>
          {/* We will use real images from Supabase later */}
          <div className={styles.overlay}></div>
          <p className={styles.caption}>MINIMALIST RESIDENTIAL COMPLEX / 2026</p>
        </div>
      </div>
    </section>
  );
}
