import { createSignal, Show, For } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Motion } from "solid-motionone";
import { type AnalysisResult } from "../../ai/gemini";
import SuggestionCard from "../SuggestionCard/SuggestionCard";
import SustainabilityGauge from "../SustainabilityGauge/SustainabilityGauge";
import { optimizeImage } from "../../lib/image-utils";
import styles from "./UploadArea.module.scss";

export default function UploadArea() {
  const [isDragging, setIsDragging] = createSignal(false);
  const [uploadedImage, setUploadedImage] = createSignal<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = createSignal(false);
  
  // Use createStore for deeply nested reactivity
  const [result, setResult] = createStore<AnalysisResult>({
    materialType: "",
    category: "",
    itemImagePrompt: "",
    condition: "",
    usability: "",
    recyclability: "",
    suggestions: [],
    tutorial: []
  });
  const [hasResult, setHasResult] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  let fileInput: HTMLInputElement | undefined;

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      // Validation: Check file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File is too large. Please upload an image smaller than 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        let base64Image = e.target?.result as string;
        setUploadedImage(base64Image);
        setIsAnalyzing(true);
        setError(null);

        try {
          // Client-side Compression: Resize and optimize for faster upload
          base64Image = await optimizeImage(base64Image);
          
          setResult({
            materialType: "",
            category: "",
            itemImagePrompt: "",
            condition: "",
            usability: "",
            recyclability: "",
            suggestions: [],
            tutorial: []
          });
          setHasResult(false);

          const response = await fetch("/api/analyze", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageBase64: base64Image }),
          });

          if (!response.ok) {
            throw new Error("Analysis failed");
          }

          const analysis = await response.json();
          setResult(analysis);
          setHasResult(true);

          // Trigger progressive image generation
          generateImagesForSuggestions(analysis);
        } catch (err) {
          setError("Failed to analyze the image. Please try again.");
          console.error(err);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImagesForSuggestions = (analysis: AnalysisResult) => {
    analysis.suggestions.forEach(async (suggestion, index) => {
      if (!suggestion.imagePrompt) return;

      // Mark as loading
      setResult(
        produce((state) => {
          if (state && state.suggestions && state.suggestions[index]) {
            state.suggestions[index].imageStatus = "loading";
          }
        })
      );

      try {
        const response = await fetch("/api/generate-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: suggestion.imagePrompt }),
        });

        if (!response.ok) {
          throw new Error("Image generation failed");
        }

        const data = await response.json();
        setResult(
          produce((state) => {
            if (state && state.suggestions && state.suggestions[index]) {
              state.suggestions[index].imageUrl = data.imageUrl;
              state.suggestions[index].imageStatus = "done";
            }
          })
        );
      } catch (err) {
        setResult(
          produce((state) => {
            if (state && state.suggestions && state.suggestions[index]) {
              state.suggestions[index].imageStatus = "error";
            }
          })
        );
      }
    });
  };

  const handleClick = () => {
    fileInput?.click();
  };

  const reset = () => {
    setUploadedImage(null);
    setResult({
      materialType: "",
      category: "",
      itemImagePrompt: "",
      condition: "",
      usability: "",
      recyclability: "",
      suggestions: [],
      tutorial: []
    });
    setHasResult(false);
  };

  // Extract score logic from UI
  const getSustainabilityScore = () => {
    if (!hasResult()) return 0;
    const { recyclability, condition } = result;
    let score = 50;
    if (recyclability === "high") score += 30;
    if (recyclability === "medium") score += 15;
    if (condition === "excellent") score += 20;
    if (condition === "good") score += 10;
    return Math.min(100, score);
  };

  return (
    <div class={styles.dashboardContainer}>
      {/* LEFT PANEL */}
      <div class={styles.leftPanel}>
        <div class={styles.panelGlass}>
          <div class={styles.panelHeader}>
            <h2>AI Upload and Analysis</h2>
            <div class={styles.aiIcon}>🧠</div>
          </div>

          <div class={styles.uploadSection}>
            <input
              ref={fileInput!}
              type="file"
              accept="image/*"
              style="display: none"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            {!uploadedImage() ? (
              <Motion.div
                class={styles.uploadPrompt}
                classList={{ [styles.dragging]: isDragging() }}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                animate={{ scale: isDragging() ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <div class={styles.uploadIconWrapper}>
                  <div class={styles.uploadIconGlow}></div>
                  <span class={styles.icon}>📷</span>
                </div>
                <h3>Scan Your Item</h3>
                <p>Drag & drop an image or click to upload</p>
                <p class={styles.uploadHint}>Max 10MB &bull; Automatic Speed Optimization</p>
                <button class={styles.uploadButton}>Choose File</button>
              </Motion.div>
            ) : (
              <div class={styles.imagePreviewContainer}>
                <Motion.div
                  class={styles.imageWrapper}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <img
                    src={uploadedImage()!}
                    alt="Uploaded item"
                    class={styles.previewImage}
                  />
                  {isAnalyzing() && (
                    <div class={styles.analyzingOverlay}>
                      <div class={styles.scanGrid}></div>
                      <div class={styles.scanLine}></div>
                      <div class={styles.scanBadge}>SCANNING IN PROGRESS...</div>
                    </div>
                  )}
                </Motion.div>

                <div class={styles.previewActions}>
                  <h3 class={styles.scanTitle}>Scan Your Item</h3>
                  <p class={styles.scanDesc}>Drag & drop an image or click to upload</p>
                  <button class={styles.uploadButton} onClick={handleClick}>
                    Choose File
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AI Log */}
          <div class={styles.aiLogSection}>
            <h4>AI ANALYSIS LOG</h4>
            <div class={styles.logTerminal}>
              <Show when={uploadedImage()}>
                <p><span>[00:01]</span> Model Loaded</p>
                <Show when={isAnalyzing()}>
                  <p class={styles.logActive}><span>[00:03]</span> Analyzing Material Composition...</p>
                  <p class={styles.logActive}><span>[00:04]</span> Assessing Recyclability...</p>
                </Show>
                <Show when={hasResult()}>
                  <p><span>[00:05]</span> Analysis Complete.</p>
                  <p><span>[00:05]</span> Generating Suggestions...</p>
                </Show>
              </Show>
              <Show when={!uploadedImage()}>
                <p class={styles.logDim}>Waiting for input...</p>
              </Show>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div class={styles.rightPanel}>
        <div class={styles.panelGlass}>
          <div class={styles.panelHeader}>
            <span class={styles.subtext}>AI INSIGHTS & OPTIONS</span>
            <h2 class={styles.glowText}>AI Insights</h2>
          </div>

          <Show when={error()}>
            <div class={styles.errorMessage}>
              <p>{error()}</p>
              <button onClick={reset}>Try Again</button>
            </div>
          </Show>

          <Show
            when={hasResult()}
            fallback={
              <div class={styles.emptyState}>
                <div class={styles.pulseOrb}></div>
                <p>Upload an item to generate insights</p>
              </div>
            }
          >
            <div class={styles.insightsContent}>
              <div class={styles.scoreSection}>
                <SustainabilityGauge score={getSustainabilityScore()} />
              </div>

              <div class={styles.indicatorsSection}>
                <h4>Recyclability Indicators:</h4>
                <div class={styles.badges}>
                  <div class={styles.badge}>
                    <span class={styles.badgeIcon}>♻️</span>
                    <span>{result.materialType}</span>
                  </div>
                  <div class={styles.badge}>
                    <span class={styles.badgeIcon}>✔️</span>
                    <span>Condition: {result.condition}</span>
                  </div>
                  <div class={styles.badge}>
                    <span class={styles.badgeIcon}>📦</span>
                    <span>Usability: {result.usability}</span>
                  </div>
                </div>
              </div>

              <div class={styles.suggestionsGrid}>
                <For each={result.suggestions}>
                  {(suggestion) => (
                    <SuggestionCard suggestion={suggestion} />
                  )}
                </For>
              </div>

              <button class={styles.primaryButton} onClick={reset}>
                Upload New Item
              </button>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
}
