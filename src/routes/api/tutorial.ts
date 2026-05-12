import { json } from "solid-start";
import { generateTutorial } from "../../ai/gemini";

export async function POST({ request }: { request: Request }) {
  try {
    const { suggestion } = await request.json();

    if (!suggestion) {
      return json({ error: "Suggestion data is required" }, { status: 400 });
    }

    const tutorial = await generateTutorial(suggestion);
    return json({ tutorial });
  } catch (error) {
    console.error("API tutorial error:", error);

    // Handle API key configuration error
    if (error instanceof Error && error.message.includes("GEMINI_API_KEY")) {
      return json(
        { error: "AI service is not configured. Please contact the administrator." },
        { status: 503 }
      );
    }

    return json(
      { error: "Failed to generate tutorial" },
      { status: 500 }
    );
  }
}