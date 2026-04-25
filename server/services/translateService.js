import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" }
});

export const translateToHindi = async (structuredData) => {
  try {
    const prompt = `
You are a professional government document translator.

Translate this JSON from English to Hindi.

RULES:
- Keep SAME JSON structure
- Translate only VALUES, not KEYS
- Simple, clear Hindi for Indian citizens
- Return ONLY valid JSON

JSON:
${JSON.stringify(structuredData, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cleanText = response.text().trim();

    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Gemini Translation error:", error);
    return null;
  }
};
