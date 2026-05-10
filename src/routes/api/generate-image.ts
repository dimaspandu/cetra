import { json } from "solid-start";
import { generateSuggestionImage } from "../../ai/gemini";

export async function POST({ request }: { request: Request }) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return json({ error: "Image prompt is required" }, { status: 400 });
    }

    const imageUrl = await generateSuggestionImage(prompt);
    return json({ imageUrl });
  } catch (error) {
    console.error("API generate-image error:", error);
    return json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}