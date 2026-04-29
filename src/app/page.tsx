import { createServerClient } from '@/lib/supabase';
import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import ContactForm from '@/components/ContactForm/ContactForm';
import styles from './page.module.css';

export const revalidate = 0;

export default async function Home() {
  const supabase = createServerClient();
  const { data: profile } = await supabase.from('profile').select('*').single();
  const { data: projects } = await supabase.from('projects').select('*').order('order', { ascending: true });

  const skills = [
    "PRECISION", "ORDER", "ENTROPY", "AXIOM", "FLUX", "RUST", "NEXT.JS", "TYPESCRIPT", 
    "POSTGRESQL", "MINIMALISM", "BRUTALISM", "NEURAL INTERFACE", "SYSTEM ARCHITECT"
  ];

  return (
    <main className={styles.main}>
      <Navbar profileName={profile?.name || 'ARCH.STUDIO'} />
      
      <Hero 
        title={profile?.philosophy || 'SYSTEM ARCHITECT'} 
        location={profile?.email || 'PHILIPPINES'} 
        bio={profile?.bio || 'Architecture is the crystallization of thought.'}
      />
      
      <div className="marquee">
        <div className="marquee-content">
          {[...skills, ...skills].map((skill, index) => (
            <span key={index}>{skill} //</span>
          ))}
        </div>
      </div>

      <section id="discipline" className="container section-padding">
        <span className="section-number">02 // DISCIPLINE</span>
        <div className={styles.philosophy}>
          {profile?.bio ? (
            profile.bio.split('\n').map((line: string, i: number) => (
              <p key={i}>{line}</p>
            ))
          ) : (
            <>
              <p>Architecture is not just the construction of buildings.</p>
              <p>It is the crystallization of thought into physical form.</p>
              <p>We build systems that endure through precision and order.</p>
            </>
          )}
        </div>
      </section>

      <section id="index" className="container section-padding">
        <span className="section-number">03 // INDEX</span>
        <div className={styles.projectHeader}>
          <h2>SELECTED WORKS</h2>
          <p>2022 — 2026</p>
        </div>
        <div className={styles.projectGrid}>
          {projects && projects.length > 0 ? (
            <div className={styles.grid}>
              {projects.map((project: any) => (
                <div key={project.id} className={styles.projectCard}>
                  <div className={styles.projectMeta}>
                    <span>{project.location}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p className={styles.projectCat}>{project.category}</p>
                  <div className={styles.projectImage}>
                    {project.thumbnail_url ? (
                      <img src={project.thumbnail_url} alt={project.title} />
                    ) : (
                      <div className={styles.placeholder}>IMAGE_PENDING</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              NO PROJECTS INITIALIZED. ACCESS ADMIN PANEL TO ADD CONTENT.
            </div>
          )}
        </div>
      </section>

      <section id="initialize" className="container section-padding">
        <span className="section-number">04 // INITIALIZE</span>
        <div className={styles.contactSection}>
          <div className={styles.contactIntro}>
            <h2>START A PROJECT</h2>
            <p>WE ARE CURRENTLY ACCEPTING NEW COMMISSIONS FOR 2026/2027.</p>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer className={`${styles.footer} container section-padding`}>
        <div className={styles.footerGrid}>
          <div>
            <span className="section-number">05 // CONNECT</span>
            <div className={styles.contactLinks}>
              <a href={`mailto:${profile?.email || 'admin@example.com'}`}>MAIL</a>
              <a href="#">GITHUB</a>
              <a href="#">LINKEDIN</a>
            </div>
          </div>
          <div className={styles.copyright}>
            <p>© 2026 {profile?.name || 'ARCH.STUDIO'}</p>
            <p>DESIGNED FOR THE END OF ENTROPY</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
