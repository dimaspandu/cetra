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
        <h2>Powered By Modern Tech</h2>
        <div class={styles.techGrid}>
          <div class={styles.techCard}>
            <h3>Google Gemini 1.5 Flash</h3>
            <p>
              The core of CETRA's intelligence. Gemini provides blazing-fast, multi-modal vision analysis, instantly recognizing materials, condition, and recyclability while generating creative reuse tutorials.
            </p>
          </div>
          <div class={styles.techCard}>
            <h3>SolidStart & MotionOne</h3>
            <p>
              Built for speed and accessibility. SolidStart provides lightning-fast rendering without virtual DOM overhead, while MotionOne powers the cinematic, glassmorphism UI interactions.
            </p>
          </div>
          <div class={styles.techCard}>
            <h3>Firebase Architecture</h3>
            <p>
              A robust, hybrid cloud backend using direct REST APIs for maximum stability on edge runtimes, ensuring that the Discovery Lab archive is always synchronized and searchable.
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
