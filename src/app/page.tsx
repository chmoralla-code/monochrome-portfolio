import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <section className="container section-padding">
        {/* Further sections will be added here */}
      </section>
    </main>
  );
}
