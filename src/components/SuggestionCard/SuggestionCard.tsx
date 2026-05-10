import { Show, createSignal, onMount } from "solid-js";
import { Motion } from "solid-motionone";
import type { Suggestion } from "../../ai/gemini";
import styles from "./SuggestionCard.module.scss";

interface SuggestionCardProps {
  suggestion: Suggestion;
  onGenerateImage?: () => void;
}

export default function SuggestionCard(props: SuggestionCardProps) {
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
        <button class={styles.actionButton}>Learn More</button>
      </div>
    </div>
  );
}
