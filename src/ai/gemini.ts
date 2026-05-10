import { GoogleGenerativeAI } from "@google/generative-ai";

// Server-side environment variables
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash-lite";

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is required. Please set it in your deployment environment.");
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
}

export interface AnalysisResult {
  materialType: string;
  condition: string;
  usability: string;
  recyclability: string;
  suggestions: Suggestion[];
}

export interface Suggestion {
  id: string;
  type: "reuse" | "recipe" | "diy" | "resale" | "donation" | "recycling";
  title: string;
  description: string;
  difficulty?: string;
  timeEstimate?: string;
  tools?: string[];
  value?: string;
  impact?: string;
  imagePrompt?: string;
  imageUrl?: string;
  imageStatus?: "idle" | "loading" | "done" | "error";
}

function cleanJsonResponse(text: string) {
  return text.replace(/```json\n?|\n?```/g, "").trim();
}

export async function analyzeImage(
  imageBase64: string,
): Promise<AnalysisResult> {
  try {
    const model = getGenAI().getGenerativeModel({
      model: MODEL_NAME,
    });

    const prompt = `
      Analyze this image of an item someone is considering discarding.

      Return ONLY a valid JSON object with this exact structure:

      {
        "materialType": "type of material",
        "condition": "excellent|good|fair|poor",
        "usability": "reusable|consumable|repairable|recyclable",
        "recyclability": "high|medium|low|none",
        "suggestions": [
          {
            "type": "reuse|recipe|diy|resale|donation|recycling",
            "title": "brief title",
            "description": "detailed description",
            "difficulty": "easy|medium|hard",
            "timeEstimate": "time estimate",
            "tools": ["tool1", "tool2"],
            "value": "estimated value",
            "impact": "environmental impact",
            "imagePrompt": "visual prompt for AI image generation"
          }
        ]
      }

      Requirements:
      - Give 3-5 realistic suggestions
      - Be practical and creative
      - Focus on sustainability
      - Return ONLY JSON
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64.split(",")[1],
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const response = await result.response;
    const text = cleanJsonResponse(response.text());
    const parsed = JSON.parse(text) as AnalysisResult;
    
    // Assign IDs and initial image status to suggestions
    parsed.suggestions = parsed.suggestions.map((s) => ({
      ...s,
      id: Math.random().toString(36).substring(2, 9),
      imageStatus: "idle",
    }));

    return parsed;
  } catch (error) {
    console.error("Gemini analyzeImage error:", error);

    // Provide more specific error messages for common issues
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        console.error("🔑 API Key Error: Gemini API key is missing or invalid");
      } else if (error.message.includes("model name")) {
        console.error("🤖 Model Error: Gemini model name is not configured");
      }
    }

    return {
      materialType: "unknown",
      condition: "good",
      usability: "reusable",
      recyclability: "medium",
      suggestions: [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: "diy",
          title: "Creative Upcycling Project",
          description:
            "Transform this item into something useful instead of throwing it away.",
          difficulty: "easy",
          timeEstimate: "20 minutes",
          tools: ["scissors", "glue"],
          value: "$5-10",
          impact: "Reduces waste and extends the life cycle of the material.",
          imagePrompt: "futuristic eco-friendly upcycled object, realistic photography",
          imageStatus: "idle",
        },
        {
          id: Math.random().toString(36).substring(2, 9),
          type: "donation",
          title: "Donate to Community",
          description:
            "Consider donating the item to someone who may still find value in it.",
          difficulty: "easy",
          timeEstimate: "10 minutes",
          impact: "Promotes reuse and reduces landfill waste.",
          imagePrompt: "donated item in a modern pristine setting, soft lighting",
          imageStatus: "idle",
        },
      ],
    };
  }
}

export async function generateSuggestionImage(prompt: string): Promise<string> {
  // Mock function simulating an API call that takes time
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would call Gemini's Imagen or another image generation API
      // For now, we return a high-quality placeholder based on keywords or just a random nice image
      // We use unsplash source with some nature/tech keywords for demonstration
      const randomId = Math.floor(Math.random() * 1000);
      resolve(`https://picsum.photos/seed/${randomId}/400/300`);
    }, 2500); // Simulate 2.5s generation time
  });
}

export async function generateTutorial(
  suggestion: Suggestion,
): Promise<string[]> {
  try {
    const model = getGenAI().getGenerativeModel({
      model: MODEL_NAME,
    });

    const prompt = `
      Generate a step-by-step tutorial for this idea:

      Title:
      ${suggestion.title}

      Description:
      ${suggestion.description}

      Return ONLY a JSON array of strings.

      Requirements:
      - 5 to 8 steps
      - Clear and beginner friendly
      - Practical instructions
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const response = await result.response;
    const text = cleanJsonResponse(response.text());

    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini generateTutorial error:", error);

    return [
      "Gather all necessary materials and tools.",
      "Clean and prepare the item carefully.",
      "Follow the transformation process step by step.",
      "Check stability and usability of the final result.",
      "Use and enjoy your sustainable creation.",
    ];
  }
}
