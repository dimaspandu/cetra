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
    return json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}