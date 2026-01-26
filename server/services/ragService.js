// services/ragService.js
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const processRAG = async (text) => {
  try {
    console.log("Using Groq API with text length:", text.length);

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

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile", // very strong + stable
      messages: [
        { role: "system", content: "You extract and structure government scheme information." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
    });

    let cleanText = completion.choices[0].message.content.trim();

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
    console.error("Groq API error:", error);

    return {
      scheme_name: "Government Scheme",
      summary: "AI processing failed. Please try again.",
      benefits: [],
      eligibility: [],
      documents: [],
      steps: [],
      eli10: "Something went wrong while reading this document.",
      warning_notes: []
    };
  }
};
