import { Show, createSignal, For } from "solid-js";
import { Motion } from "solid-motionone";
import type { Suggestion } from "../../ai/gemini";
import styles from "./SuggestionCard.module.scss";

interface SuggestionCardProps {
  suggestion: Suggestion;
  onGenerateImage?: () => void;
}

export default function SuggestionCard(props: SuggestionCardProps) {
  const [isLearningMore, setIsLearningMore] = createSignal(false);
  const [tutorialSteps, setTutorialSteps] = createSignal<string[]>([]);
  const [error, setError] = createSignal<string | null>(null);

  const handleLearnMore = async () => {
    if (tutorialSteps().length > 0) {
      setTutorialSteps([]);
      return;
    }

    setIsLearningMore(true);
    setError(null);
    try {
      const res = await fetch("/api/tutorial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suggestion: props.suggestion }),
      });
      if (!res.ok) {
        throw new Error("Failed to load tutorial");
      }
      const data = await res.json();
      if (data.tutorial) {
        setTutorialSteps(data.tutorial);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to generate tutorial.");
    } finally {
      setIsLearningMore(false);
    }
  };

  return (
    <div class={styles.card}>
      <div class={styles.header}>
        <h5 class={styles.title}>{props.suggestion.title}</h5>
        <span class={styles.typeTag}>({props.suggestion.type})</span>
      </div>

      <div class={styles.imageContainer}>
        <Show
          when={props.suggestion.imageStatus === "done" && props.suggestion.imageUrl}
          fallback={
            <div class={styles.imagePlaceholder}>
              <div class={styles.shimmer}></div>
              <Show when={props.suggestion.imageStatus === "loading"}>
                <span class={styles.loadingText}>Generating visual concept...</span>
              </Show>
              <Show when={props.suggestion.imageStatus === "idle"}>
                <span class={styles.loadingText}>Awaiting generation...</span>
              </Show>
            </div>
          }
        >
          <Motion.img
            src={props.suggestion.imageUrl}
            alt={props.suggestion.title}
            class={styles.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </Show>
      </div>

      <div class={styles.content}>
        <p class={styles.description}>{props.suggestion.description}</p>
        <Show when={props.suggestion.impact}>
          <div class={styles.impact}>
            <span class={styles.impactIcon}>🌱</span>
            <span>{props.suggestion.impact}</span>
          </div>
        </Show>
      </div>

      <div class={styles.actions}>
        <button 
          class={styles.actionButton} 
          onClick={handleLearnMore} 
          disabled={isLearningMore()}
        >
          {isLearningMore() ? "Loading..." : tutorialSteps().length > 0 ? "Show Less" : "Learn More"}
        </button>
      </div>

      <Show when={tutorialSteps().length > 0 || error()}>
        <div class={styles.tutorial}>
          <Show when={error()}>
            <p class={styles.error}>{error()}</p>
          </Show>
          <Show when={tutorialSteps().length > 0}>
            <h6 class={styles.tutorialTitle}>Step-by-Step Guide</h6>
            <ol class={styles.tutorialSteps}>
              <For each={tutorialSteps()}>
                {(step) => <li>{step}</li>}
              </For>
            </ol>
          </Show>
        </div>
      </Show>
    </div>
  );
}
