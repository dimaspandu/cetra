import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer class={styles.footer}>
      <div class={styles.container}>
        <div class={styles.content}>
          <p>
            Built with 💚 for <a href="https://rsvp.withgoogle.com/events/juaravibecoding/home" target="_blank" rel="noopener noreferrer" class={styles.link}>#JuaraVibeCoding</a>
          </p>
          <p class={styles.subtext}>
            Powered by Google Gemini.
          </p>
        </div>
      </div>
    </footer>
  );
}
