import { json } from "solid-start";
import { generateTutorial, type Suggestion } from "../../ai/gemini";

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
    return json(
      { error: "Failed to generate tutorial" },
      { status: 500 }
    );
  }
}