import { json } from "solid-start";
import { analyzeImage, type AnalysisResult } from "../../ai/gemini";

export async function POST({ request }: { request: Request }) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return json({ error: "Image data is required" }, { status: 400 });
    }

    const result = await analyzeImage(imageBase64);
    return json(result);
  } catch (error) {
    console.error("API analyze error:", error);

    // Handle API key configuration error
    if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
      return json(
        { error: "AI service is not configured. Please contact the administrator." },
        { status: 503 }
      );
    }

    return json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}