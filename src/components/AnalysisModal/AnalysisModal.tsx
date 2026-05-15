import { Show, For } from "solid-js";
import { Motion, Presence } from "solid-motionone";
import styles from "./AnalysisModal.module.scss";

interface AnalysisModalProps {
  item: any | null;
  onClose: () => void;
}

export default function AnalysisModal(props: AnalysisModalProps) {
  const getImageUrl = (prompt: string, id: string) => {
    const encoded = encodeURIComponent(prompt.replace(/[^\w\s,-]/g, "").trim());
    return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=600&seed=${id}&nologo=true`;
  };

  return (
    <Presence>
      <Show when={props.item}>
        <div class={styles.modalOverlay} onClick={props.onClose}>
          <Motion.div 
            class={styles.modalContent} 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <button class={styles.closeBtn} onClick={props.onClose}>&times;</button>
            
            <div class={styles.modalBody}>
              <div class={styles.imageSection}>
                <img 
                  src={`https://loremflickr.com/800/600/${encodeURIComponent(props.item.materialType || "sustainability")},recycle/all`} 
                  alt={props.item.materialType} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                <div class={styles.imageOverlay}>
                  <span class={styles.categoryBadge}>{props.item.category}</span>
                  <h2>{props.item.materialType}</h2>
                </div>
              </div>

              <div class={styles.detailsSection}>
                <div class={styles.gridInfo}>
                  <div class={styles.infoCard}>
                    <label>Condition</label>
                    <p>{props.item.condition}</p>
                  </div>
                  <div class={styles.infoCard}>
                    <label>Usability</label>
                    <p>{props.item.usability}</p>
                  </div>
                  <div class={styles.infoCard}>
                    <label>Recyclability</label>
                    <p>{props.item.recyclability}</p>
                  </div>
                </div>

                <div class={styles.suggestionsSection}>
                  <h3>Reuse Suggestions</h3>
                  <div class={styles.suggestionsList}>
                    <For each={props.item.suggestions}>
                      {(suggestion: any) => (
                        <div class={styles.suggestionItem}>
                          <h4>{suggestion.title}</h4>
                          <p>{suggestion.description}</p>
                          <span class={styles.impactBadge}>{suggestion.impact}</span>
                        </div>
                      )}
                    </For>
                  </div>
                </div>

                <Show when={props.item.tutorial && props.item.tutorial.length > 0}>
                  <div class={styles.tutorialSection}>
                    <h3>Preparation Guide</h3>
                    <div class={styles.tutorialSteps}>
                      <For each={props.item.tutorial}>
                        {(step: any) => (
                          <div class={styles.stepItem}>
                            <div class={styles.stepNumber}>{step.step}</div>
                            <div class={styles.stepContent}>
                              <h4>{step.title}</h4>
                              <p>{step.action}</p>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                </Show>
              </div>
            </div>
          </Motion.div>
        </div>
      </Show>
    </Presence>
  );
}
