import { json } from "solid-start";
import { analyzeImage } from "../../ai/gemini";
import { db } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST({ request }: { request: Request }) {
  try {
    const { imageBase64 } = await request.json();

    if (!imageBase64) {
      return json({ error: "Image data is required" }, { status: 400 });
    }

    // 1. Perform AI Analysis
    const result = await analyzeImage(imageBase64);

    // 2. Archive the result in Firestore (Fire and Forget)
    addDoc(collection(db, "analyses"), {
      ...result,
      uploadId: "rest-" + Date.now(),
      createdAt: serverTimestamp(),
    }).catch(dbError => {
      console.error("Failed to archive analysis in background:", dbError);
    });

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