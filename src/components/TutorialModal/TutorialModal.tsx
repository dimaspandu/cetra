import { For, Show, createEffect, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
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
    <Show when={props.isOpen}>
      <Portal>
        <div class={styles.backdrop} onClick={props.onClose}>
          <section
            class={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tutorial-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header class={styles.header}>
              <div>
                <span class={styles.kicker}>Tutorial</span>
                <h2 id="tutorial-modal-title" class={styles.title}>
                  {props.suggestion.title}
                </h2>
              </div>
              <button
                class={styles.closeButton}
                type="button"
                aria-label="Close tutorial"
                onClick={props.onClose}
              >
                x
              </button>
            </header>

            <div class={styles.body}>
              <p class={styles.description}>{props.suggestion.description}</p>

              <Show when={props.error}>
                <p class={styles.error}>{props.error}</p>
              </Show>

              <Show when={props.steps.length > 0}>
                <section class={styles.section}>
                  <h3 class={styles.sectionTitle}>Step-by-Step Guide</h3>
                  <ol class={styles.steps}>
                    <For each={props.steps}>{(step) => <li>{step}</li>}</For>
                  </ol>
                </section>
              </Show>

              <Show when={props.references.length > 0}>
                <section class={styles.section}>
                  <h3 class={styles.sectionTitle}>References</h3>
                  <ul class={styles.references}>
                    <For each={props.references}>
                      {(reference) => (
                        <li>
                          <a href={reference.url} target="_blank" rel="noreferrer">
                            {reference.title}
                          </a>
                          <span>{reference.sourceType}</span>
                        </li>
                      )}
                    </For>
                  </ul>
                </section>
              </Show>
            </div>
          </section>
        </div>
      </Portal>
    </Show>
  );
}
