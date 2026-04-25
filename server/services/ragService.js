import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" }
});

export const processRAG = async (text) => {
  try {
    const truncatedText =
      text.length > 12000 ? text.substring(0, 12000) + "..." : text;

    const prompt = `
You are a senior government policy analyst AI.

Extract structured information from this government scheme document.

STRICT RULES:
- English only
- Do not skip any field
- If something is missing, write "Not clearly specified in the document"
- benefits, eligibility, documents, steps, warning_notes must always be arrays

Return ONLY valid JSON in this format:

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
    const cleanText = response.text().trim();

    const parsed = JSON.parse(cleanText);

    return {
      scheme_name: parsed.scheme_name || "Government Scheme",
      summary: parsed.summary || "",
      benefits: Array.isArray(parsed.benefits) ? parsed.benefits : [],
      eligibility: Array.isArray(parsed.eligibility) ? parsed.eligibility : [],
      documents: Array.isArray(parsed.documents) ? parsed.documents : [],
      steps: Array.isArray(parsed.steps) ? parsed.steps : [],
      eli10: parsed.eli10 || "",
      warning_notes: Array.isArray(parsed.warning_notes) ? parsed.warning_notes : []
    };

  } catch (error) {
    console.error("Gemini RAG error:", error);
    throw error;
  }
};
