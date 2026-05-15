import { For, Show, createEffect, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import { Motion, Presence } from "solid-motionone";
import type { Suggestion, TutorialReference } from "../../ai/gemini";
import styles from "./TutorialModal.module.scss";

interface TutorialModalProps {
  isOpen: boolean;
  suggestion: Suggestion;
  steps: string[];
  references: TutorialReference[];
  error?: string | null;
  onClose: () => void;
}

export default function TutorialModal(props: TutorialModalProps) {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      props.onClose();
    }
  };

  createEffect(() => {
    if (!props.isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  return (
    <Presence>
      <Show when={props.isOpen}>
        <Portal>
          <div class={styles.backdrop} onClick={props.onClose}>
            <Motion.section
              class={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-labelledby="tutorial-modal-title"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <button
                class={styles.closeButton}
                type="button"
                aria-label="Close tutorial"
                onClick={props.onClose}
              >
                &times;
              </button>

              <div class={styles.modalBody}>
                <header class={styles.header}>
                  <div class={styles.headerContent}>
                    <span class={styles.kicker}>Tutorial</span>
                    <h2 id="tutorial-modal-title" class={styles.title}>
                      {props.suggestion.title}
                    </h2>
                    <p class={styles.description}>{props.suggestion.description}</p>
                  </div>
                </header>

                <div class={styles.contentSection}>
                  <Show when={props.error}>
                    <div class={styles.errorContainer}>
                      <p class={styles.error}>{props.error}</p>
                    </div>
                  </Show>

                  <Show when={props.steps.length > 0}>
                    <section class={styles.section}>
                      <h3 class={styles.sectionTitle}>Step-by-Step Guide</h3>
                      <div class={styles.stepsList}>
                        <For each={props.steps}>
                          {(step, index) => (
                            <div class={styles.stepItem}>
                              <div class={styles.stepNumber}>{index() + 1}</div>
                              <p class={styles.stepText}>{step}</p>
                            </div>
                          )}
                        </For>
                      </div>
                    </section>
                  </Show>

                  <Show when={props.references.length > 0}>
                    <section class={styles.section}>
                      <h3 class={styles.sectionTitle}>Research & References</h3>
                      <div class={styles.referencesGrid}>
                        <For each={props.references}>
                          {(reference) => (
                            <a 
                              href={reference.url} 
                              target="_blank" 
                              rel="noreferrer"
                              class={styles.referenceCard}
                            >
                              <span class={styles.refType}>{reference.sourceType}</span>
                              <h4 class={styles.refTitle}>{reference.title}</h4>
                              <span class={styles.viewLink}>View Source &rarr;</span>
                            </a>
                          )}
                        </For>
                      </div>
                    </section>
                  </Show>
                </div>
              </div>
            </Motion.section>
          </div>
        </Portal>
      </Show>
    </Presence>
  );
}
