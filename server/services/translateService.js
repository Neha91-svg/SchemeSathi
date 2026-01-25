import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const translateToHindi = async (structuredData) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    });

    const prompt = `
You are a professional government document translator.

Translate the following JSON from English to Hindi.

Rules:
- Keep the SAME JSON structure.
- Translate only values, never change keys.
- Use simple, clear Hindi suitable for Indian citizens.
- Do not add new information.
- Return ONLY valid JSON.

JSON:
${JSON.stringify(structuredData, null, 2)}
`;

    const result = await model.generateContent(prompt);
    let cleanText = result.response.text().trim();
    cleanText = cleanText.replace(/```json\s*/g, "").replace(/```\s*/g, "");

    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Translation error:", error.message);
    return null;
  }
};
