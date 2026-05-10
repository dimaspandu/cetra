import { createSignal, Show, For } from "solid-js";
import { Motion } from "solid-motionone";
import { analyzeImage, type AnalysisResult } from "../ai/gemini";
import styles from "./UploadArea.module.scss";

export default function UploadArea() {
  const [isDragging, setIsDragging] = createSignal(false);
  const [uploadedImage, setUploadedImage] = createSignal<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = createSignal(false);
  const [result, setResult] = createSignal<AnalysisResult | null>(null);
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
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;
        setUploadedImage(base64Image);
        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
          // Call the Gemini API
          const analysis = await analyzeImage(base64Image);
          setResult(analysis);
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

  const handleClick = () => {
    fileInput?.click();
  };

  return (
    <Motion.div
      class={styles.uploadArea}
      classList={{ [styles.dragging]: isDragging() }}
      animate={{ scale: isDragging() ? 1.05 : 1 }}
      transition={{ duration: 0.3 }}
    >
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
        <div
          class={styles.uploadPrompt}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div class={styles.uploadIcon}>📷</div>
          <h3>Scan Your Item</h3>
          <p>Drag & drop an image or click to upload</p>
          <div class={styles.uploadButton}>Choose File</div>
        </div>
      ) : (
        <div class={styles.imagePreview}>
          <Motion.img
            src={uploadedImage()!}
            alt="Uploaded item"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          {isAnalyzing() && (
            <div class={styles.analyzingOverlay}>
              <div class={styles.scanLine}></div>
              <p>AI is analyzing...</p>
            </div>
          )}

          <Show when={error()}>
            <div class={styles.errorMessage}>
              {error()}
              <button
                onClick={() => setUploadedImage(null)}
              >
                Try Again
              </button>
            </div>
          </Show>

          <Show when={result()}>
            <Motion.div
              class={styles.analysisResults}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3>AI Insights</h3>
              <div class={styles.badges}>
                <div class={styles.badge}>
                  <strong>Material:</strong> {result()?.materialType}
                </div>
                <div class={styles.badge}>
                  <strong>Condition:</strong> {result()?.condition}
                </div>
              </div>

              <h4>Possibilities</h4>
              <div class={styles.suggestionsGrid}>
                <For each={result()?.suggestions}>
                  {(suggestion) => (
                    <div class={styles.suggestionCard}>
                      <h5>
                        {suggestion.title}{" "}
                        <span>({suggestion.type})</span>
                      </h5>
                      <p>{suggestion.description}</p>
                      <Show when={suggestion.impact}>
                        <p class={styles.impact}>
                          🌱 {suggestion.impact}
                        </p>
                      </Show>
                    </div>
                  )}
                </For>
              </div>

              <button
                onClick={() => {
                  setUploadedImage(null);
                  setResult(null);
                }}
              >
                Scan Another Item
              </button>
            </Motion.div>
          </Show>
        </div>
      )}
    </Motion.div>
  );
}
