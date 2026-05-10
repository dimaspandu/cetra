import { createSignal, Show, For } from "solid-js";
import { Motion } from "solid-motionone";
import { analyzeImage, type AnalysisResult } from "../ai/gemini";

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
      class="upload-area"
      classList={{ dragging: isDragging() }}
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
          class="upload-prompt"
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div class="upload-icon">📷</div>
          <h3>Scan Your Item</h3>
          <p>Drag & drop an image or click to upload</p>
          <div class="upload-button">Choose File</div>
        </div>
      ) : (
        <div class="image-preview">
          <Motion.img
            src={uploadedImage()!}
            alt="Uploaded item"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          {isAnalyzing() && (
            <div class="analyzing-overlay">
              <div class="scan-line"></div>
              <p>AI is analyzing...</p>
            </div>
          )}

          <Show when={error()}>
            <div
              class="error-message"
              style="color: #ff4d4f; margin-top: 1rem;"
            >
              {error()}
              <button
                onClick={() => setUploadedImage(null)}
                style="margin-left: 1rem;"
              >
                Try Again
              </button>
            </div>
          </Show>

          <Show when={result()}>
            <Motion.div
              class="analysis-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style="margin-top: 2rem; text-align: left; background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; backdrop-filter: blur(10px);"
            >
              <h3 style="margin-bottom: 1rem; color: #3fb950;">AI Insights</h3>
              <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                <div
                  class="badge"
                  style="background: rgba(63, 185, 80, 0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;"
                >
                  <strong>Material:</strong> {result()?.materialType}
                </div>
                <div
                  class="badge"
                  style="background: rgba(63, 185, 80, 0.2); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;"
                >
                  <strong>Condition:</strong> {result()?.condition}
                </div>
              </div>

              <h4 style="margin-bottom: 1rem;">Possibilities</h4>
              <div class="suggestions-grid" style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));">
                <For each={result()?.suggestions}>
                  {(suggestion) => (
                    <div
                      class="suggestion-card"
                      style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 8px;"
                    >
                      <h5 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">
                        {suggestion.title}{" "}
                        <span style="font-size: 0.8rem; opacity: 0.7; font-weight: normal;">
                          ({suggestion.type})
                        </span>
                      </h5>
                      <p style="margin: 0 0 0.5rem 0; font-size: 0.95rem; opacity: 0.9;">
                        {suggestion.description}
                      </p>
                      <Show when={suggestion.impact}>
                        <p style="margin: 0; font-size: 0.85rem; color: #3fb950;">
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
                style="margin-top: 1.5rem; width: 100%; padding: 0.75rem; border-radius: 8px; border: none; background: #3fb950; color: white; cursor: pointer; font-weight: bold;"
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
