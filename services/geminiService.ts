
import { GoogleGenAI, Type } from "@google/genai";
import { DiveEntry, GeminiInsight } from "../types";

// Initialize the Google GenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates AI-powered insights for a specific dive entry using Gemini.
 */
export async function getDiveInsight(dive: DiveEntry): Promise<GeminiInsight | null> {
  const prompt = `Based on these scuba diving conditions:
  Site: ${dive.diveSite}
  Visibility: ${dive.visibility}
  Water Temperature: ${dive.waterTemp}
  Current: ${dive.current}
  Wave Conditions: ${dive.waves}

  Provide a brief "Pro Diver Insight" for this specific environment. 
  The response must be in JSON format with fields: title, content, advice.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { 
              type: Type.STRING,
              description: 'A catchy title for the insight.'
            },
            content: { 
              type: Type.STRING,
              description: 'The main body of the pro diver insight.'
            },
            advice: { 
              type: Type.STRING,
              description: 'Specific actionable advice for the diver.'
            },
          },
          required: ["title", "content", "advice"]
        },
      },
    });

    // Access the text property directly (not a method).
    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      return null;
    }

    return JSON.parse(jsonStr) as GeminiInsight;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}
