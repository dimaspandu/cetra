import { createSignal, onMount, onCleanup, Show } from "solid-js";
import { Portal } from "solid-js/web";
import styles from "./WelcomeModal.module.scss";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = createSignal(false);

  onMount(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      // Small delay for cinematic effect after page load
      setTimeout(() => {
        setIsOpen(true);
        document.body.style.overflow = "hidden";
      }, 500);
    }
  });

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenWelcome", "true");
    document.body.style.overflow = "";
  };

  onCleanup(() => {
    if (isOpen()) {
      document.body.style.overflow = "";
    }
  });

  return (
    <Show when={isOpen()}>
      <Portal>
        <div class={styles.backdrop} onClick={handleClose}>
          <div
            class={styles.modal}
            role="dialog"
            aria-labelledby="welcome-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div class={styles.modalContent}>
              <div class={styles.iconWrapper}>
                <span class={styles.icon}>🌱</span>
              </div>
              <h2 id="welcome-modal-title" class={styles.title}>
                Welcome to CETRA
              </h2>
              <p class={styles.subtitle}>
                Circular Economy & Transformative Reuse Assistant
              </p>

              <div class={styles.sections}>
                <section class={styles.section}>
                  <h3>What is CETRA?</h3>
                  <p>
                    CETRA is your personal AI sustainability companion. It uses advanced vision AI to look at items you're about to throw away and instantly gives you creative ways to reuse, upcycle, or properly recycle them.
                  </p>
                </section>

                <section class={styles.section}>
                  <h3>How to use it?</h3>
                  <ol class={styles.stepsList}>
                    <li>
                      <span class={styles.stepNumber}>1</span>
                      <p><strong>Snap or Upload:</strong> Drop an image of an item (e.g., a glass jar, old electronics, or food scraps) into the dashboard.</p>
                    </li>
                    <li>
                      <span class={styles.stepNumber}>2</span>
                      <p><strong>AI Analysis:</strong> Our AI will instantly scan the item to determine its material, condition, and recyclability.</p>
                    </li>
                    <li>
                      <span class={styles.stepNumber}>3</span>
                      <p><strong>Discover Ideas:</strong> Browse through step-by-step guides to give your item a brilliant second life!</p>
                    </li>
                  </ol>
                </section>
              </div>

              <button class={styles.startButton} onClick={handleClose}>
                Let's Get Started
              </button>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
