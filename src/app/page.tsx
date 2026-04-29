import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import styles from './page.module.css';

export default function Home() {
  const skills = [
    "PRECISION", "ORDER", "ENTROPY", "AXIOM", "FLUX", "RUST", "NEXT.JS", "TYPESCRIPT", 
    "POSTGRESQL", "MINIMALISM", "BRUTALISM", "NEURAL INTERFACE", "SYSTEM ARCHITECT"
  ];

  return (
    <main className={styles.main}>
      <Navbar />
      <Hero />
      
      <div className="marquee">
        <div className="marquee-content">
          {[...skills, ...skills].map((skill, index) => (
            <span key={index}>{skill} //</span>
          ))}
        </div>
      </div>

      <section className="container section-padding">
        <span className="section-number">02 // DISCIPLINE</span>
        <div className={styles.philosophy}>
          <p>Architecture is not just the construction of buildings.</p>
          <p>It is the crystallization of thought into physical form.</p>
          <p>We build systems that endure through precision and order.</p>
        </div>
      </section>

      <section className="container section-padding">
        <span className="section-number">03 // INDEX</span>
        <div className={styles.projectHeader}>
          <h2>SELECTED WORKS</h2>
          <p>2022 — 2026</p>
        </div>
        <div className={styles.projectGrid}>
          {/* This will be populated from Supabase */}
          <div className={styles.emptyState}>
            NO PROJECTS INITIALIZED. ACCESS ADMIN PANEL TO ADD CONTENT.
          </div>
        </div>
      </section>

      <footer className={`${styles.footer} container section-padding`}>
        <div className={styles.footerGrid}>
          <div>
            <span className="section-number">04 // CONNECT</span>
            <div className={styles.contactLinks}>
              <a href="mailto:admin@example.com">MAIL</a>
              <a href="#">GITHUB</a>
              <a href="#">LINKEDIN</a>
            </div>
          </div>
          <div className={styles.copyright}>
            <p>© 2026 ARCH.STUDIO</p>
            <p>DESIGNED FOR THE END OF ENTROPY</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
