import { createSignal } from "solid-js";
import { A } from "@solidjs/router";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen());
    if (!isOpen()) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden"; // Prevent scrolling when menu is open
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <nav class={styles.navbar}>
      <div class={styles.navContent}>
        <A href="/" class={styles.navLogo} onClick={closeMenu}>
          CETRA
        </A>

        {/* Hamburger Icon */}
        <div 
          class={`${styles.hamburger} ${isOpen() ? styles.open : ""}`} 
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Desktop & Mobile Links */}
        <div class={`${styles.navLinks} ${isOpen() ? styles.open : ""}`}>
          <A href="/" class={styles.link} activeClass={styles.active} end onClick={closeMenu}>
            Home
          </A>
          <A href="/archive" class={styles.link} activeClass={styles.active} onClick={closeMenu}>
            Discovery Lab
          </A>
        </div>
      </div>
    </nav>
  );
}
