
import { GoogleGenAI } from "@google/genai";

export const checkGrammar = async (text: string): Promise<string> => {
  if (!process.env.API_KEY) {
    // In a real app, you'd have a more robust way to handle this,
    // but for this example, we'll return a mock suggestion.
    return `(Mock API) The grammar seems correct, but perhaps rephrase for clarity. Original: "${text}"`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `You are an expert editor. Correct any grammatical errors in the following text. Provide only the corrected text as a single string, without any preamble or explanation. If the text is already correct, return it as is. Text to correct: "${text}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error checking grammar with Gemini API:", error);
    return "Could not check grammar at this time. Please try again later.";
  }
};
