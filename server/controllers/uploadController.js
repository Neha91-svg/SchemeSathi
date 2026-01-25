import { parsePDF } from "../utils/pdfParser.js";
import { processRAG } from "../services/ragService.js";
import { translateToHindi } from "../services/translateService.js";
import fs from "fs";

export const uploadPDF = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    filePath = req.file.path;

    const text = await parsePDF(filePath);
    if (!text || text.trim().length === 0) {
      throw new Error("No text extracted from PDF");
    }

    // 1️⃣ English structured data
    const englishData = await processRAG(text);

    // 2️⃣ Hindi translation
    const hindiData = await translateToHindi(englishData);

    fs.unlinkSync(filePath);

    // 3️⃣ Send both
    res.json({
      success: true,
      english: englishData,
      hindi: hindiData
    });

  } catch (error) {
    console.error("PDF Processing Error:", error);

    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(500).json({
      success: false,
      message: "Error processing PDF",
      error: error.message
    });
  }
};
