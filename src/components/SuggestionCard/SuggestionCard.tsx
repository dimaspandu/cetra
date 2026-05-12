import { Show, createSignal } from "solid-js";
import { Motion } from "solid-motionone";
import type { Suggestion, TutorialResult } from "../../ai/gemini";
import TutorialModal from "../TutorialModal/TutorialModal";
import styles from "./SuggestionCard.module.scss";

interface SuggestionCardProps {
  suggestion: Suggestion;
  onGenerateImage?: () => void;
}

export default function SuggestionCard(props: SuggestionCardProps) {
  const [isLearningMore, setIsLearningMore] = createSignal(false);
  const [isTutorialOpen, setIsTutorialOpen] = createSignal(false);
  const [tutorial, setTutorial] = createSignal<TutorialResult>({
    steps: [],
    references: [],
  });
  const [error, setError] = createSignal<string | null>(null);

  const handleLearnMore = async () => {
    if (tutorial().steps.length > 0 || error()) {
      setIsTutorialOpen(true);
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
        setTutorial(
          Array.isArray(data.tutorial)
            ? { steps: data.tutorial, references: [] }
            : {
                steps: Array.isArray(data.tutorial.steps) ? data.tutorial.steps : [],
                references: Array.isArray(data.tutorial.references)
                  ? data.tutorial.references
                  : [],
              },
        );
        setIsTutorialOpen(true);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to generate tutorial.");
      setIsTutorialOpen(true);
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
          {isLearningMore() ? "Loading..." : "Learn More"}
        </button>
      </div>

      <TutorialModal
        isOpen={isTutorialOpen()}
        suggestion={props.suggestion}
        steps={tutorial().steps}
        references={tutorial().references}
        error={error()}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
}
