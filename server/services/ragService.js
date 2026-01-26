// services/ragService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyD_TEST_KEY_REPLACE_ME";
const genAI = new GoogleGenerativeAI(apiKey);

export const processRAG = async (text) => {
  try {
    console.log("Using Gemini API with text length:", text.length);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const truncatedText =
      text.length > 12000 ? text.substring(0, 12000) + "..." : text;

    const prompt = `
You are a senior government policy analyst AI.

First, carefully read the document.
Second, identify sections like Benefits, Eligibility, Documents, Process, Warnings.
Third, convert them into structured JSON.

STRICT:
- English only
- Do not skip any field
- If not found, write "Not clearly specified in the document"
- benefits, eligibility, documents, steps, warning_notes must always be arrays.

Return only this JSON:

{
  "scheme_name": "",
  "summary": "",
  "benefits": [],
  "eligibility": [],
  "documents": [],
  "steps": [],
  "eli10": "",
  "warning_notes": []
}

Document:
${truncatedText}
`;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    let cleanText = response.text().trim();

    cleanText = cleanText.replace(/```json\s*/g, "").replace(/```\s*/g, "");

    const parsed = JSON.parse(cleanText);

    // 🛡 Safety layer so UI never breaks
    const safeResponse = {
      scheme_name: parsed.scheme_name || "Government Scheme",
      summary: parsed.summary || "",
      benefits: Array.isArray(parsed.benefits) ? parsed.benefits : [],
      eligibility: Array.isArray(parsed.eligibility) ? parsed.eligibility : [],
      documents: Array.isArray(parsed.documents) ? parsed.documents : [],
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      eli10: parsed.eli10 || "",
      warning_notes: Array.isArray(parsed.warning_notes) ? parsed.warning_notes : []
    };

    return safeResponse;

  } catch (error) {
    console.error("Gemini API error:", error.message);

    return {
      scheme_name: "Government Scheme",
      summary: "AI processing failed. Please check your API key or try again.",
      benefits: [],
      eligibility: [],
      documents: [],
      steps: [],
      eli10: "Something went wrong while reading this document.",
      warning_notes: []
    };
  }
};
