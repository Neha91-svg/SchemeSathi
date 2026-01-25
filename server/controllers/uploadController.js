import { parsePDF } from "../utils/pdfParser.js";
import { processRAG } from "../services/ragService.js";

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Extract text from PDF
    const text = await parsePDF(req.file.path);

    // Process text with RAG & LLM
    const response = await processRAG(text);

    res.json({ summary: response.summary, eli10: response.eli10 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing PDF", error: error.message });
  }
};
