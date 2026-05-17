import { A } from "@solidjs/router";
import styles from "./about.module.scss";

export default function About() {
  return (
    <main class={styles.aboutPage}>
      <div class={`${styles.heroSection} ${styles.animateFadeInUp}`}>
        <h1 class={styles.title}>CETRA</h1>
        <p class={styles.subtitle}>
          Circular Economy & Transformative Reuse Assistant. <br/>
          AI that sees value before you throw it away.
        </p>
        <div class={`${styles.heroImageWrapper} ${styles.delay1}`}>
          <img 
            src="/cetra-ai-sustainability-hero.png" 
            alt="CETRA AI Circular Economy Ecosystem and Upcycling Innovation" 
            class={styles.heroImage} 
            loading="lazy"
          />
        </div>
      </div>

      <div class={`${styles.missionSection} ${styles.animateFadeInUp} ${styles.delay1}`}>
        <h2>Our Mission</h2>
        <p>
          Every year, millions of tons of perfectly usable materials are sent to landfills simply because we lack the inspiration or knowledge to reuse them. CETRA was built to change that narrative.
        </p>
        <p>
          By leveraging advanced AI vision technology, CETRA acts as your personal sustainability companion. Whether you're holding a glass jar, a broken electronic component, or leftover food, CETRA analyzes the item and provides instant, creative, and actionable upcycling ideas.
        </p>
        <p>
          Our goal is to make the circular economy accessible to everyone—from eco-conscious youth to elderly users looking for simple, step-by-step preparation guides—reducing household waste one item at a time.
        </p>
      </div>

      <div class={`${styles.techSection} ${styles.animateFadeInUp} ${styles.delay2}`}>
        <h2>Community & Impact</h2>
        <div class={styles.techGrid}>
          <div class={styles.techCard}>
            <h3>Reduce Household Waste</h3>
            <p>
              By instantly identifying secondary uses for everyday items, we help divert usable materials from landfills and extend their natural lifecycle.
            </p>
          </div>
          <div class={styles.techCard}>
            <h3>Empower Creative Upcycling</h3>
            <p>
              You don't need to be a DIY expert. CETRA breaks down complex ideas into simple, step-by-step preparation guides accessible to all ages.
            </p>
          </div>
          <div class={styles.techCard}>
            <h3>Foster a Circular Economy</h3>
            <p>
              Through the Discovery Lab, we archive successful item transformations, creating a shared knowledge base of inspiration for a more sustainable future.
            </p>
          </div>
        </div>
      </div>

      <div class={`${styles.ctaSection} ${styles.animateFadeInUp} ${styles.delay3}`}>
        <h2>Ready to reduce your waste?</h2>
        <A href="/" class={styles.ctaButton}>
          Scan An Item
        </A>
      </div>
    </main>
  );
}
