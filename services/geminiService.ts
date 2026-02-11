
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Domain, Analytics } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateAdaptiveQuestions(weakObjective: string): Promise<Question[]> {
  // Use gemini-3-pro-preview for complex reasoning and code generation tasks
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `As a MongoDB Expert, generate 5 high-difficulty corrective micro-questions for Objective ${weakObjective}. 
    Focus on code-based options, explain() output analysis, or real mongosh syntax. 
    Ensure answers are tricky but valid in MongoDB 171v98 context.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            domain: { type: Type.STRING },
            objectiveId: { type: Type.STRING },
            scenario: { type: Type.STRING },
            code: { type: Type.STRING },
            questionText: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswers: { type: Type.ARRAY, items: { type: Type.NUMBER } },
            type: { type: Type.STRING },
            explanation: { type: Type.STRING },
            difficulty: { type: Type.STRING }
          },
          required: ["id", "scenario", "questionText", "options", "correctAnswers", "explanation"]
        }
      }
    }
  });

  try {
    // response.text is a property, not a method
    const text = response.text;
    return text ? JSON.parse(text) : [];
  } catch (e) {
    console.error("Failed to parse adaptive questions", e);
    return [];
  }
}

export async function getPerformanceAdvice(analytics: Analytics): Promise<string> {
  // Use gemini-3-pro-preview for detailed performance analysis
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze these MongoDB Exam results: ${JSON.stringify(analytics)}. 
    Provide a concise, professional study strategy for a DBA candidate. Highlight specific MongoDB commands or concepts they need to re-master.`
  });
  // response.text is a property, not a method
  return response.text || "Keep practicing!";
}
