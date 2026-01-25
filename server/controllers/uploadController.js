import { parsePDF } from "../utils/pdfParser.js";
import { processRAG } from "../services/ragService.js";
import fs from "fs";

export const uploadPDF = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false
      });
    }

    filePath = req.file.path;

    // Validate file exists
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({
        message: "Uploaded file not found",
        success: false
      });
    }

    // Validate file is PDF
    if (!req.file.mimetype.includes('pdf')) {
      // Clean up the uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: "File must be a PDF",
        success: false
      });
    }

    // Extract text from PDF
    const text = await parsePDF(filePath);

    // Validate extracted text
    if (!text || text.trim().length === 0) {
      throw new Error("No text could be extracted from the PDF");
    }

    // Process text with RAG & LLM
    const response = await processRAG(text);

    // Clean up the uploaded file after successful processing
    fs.unlinkSync(filePath);

    res.json({
      summary: response.summary,
      eli10: response.eli10,
      success: true
    });

  } catch (error) {
    console.error("PDF Processing Error:", error);

    // Clean up file if it exists
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error("Error cleaning up file:", cleanupError);
      }
    }

    // Send appropriate error response
    const statusCode = error.message.includes('parse') ? 400 : 500;

    res.status(statusCode).json({
      message: "Error processing PDF",
      error: error.message,
      success: false
    });
  }
};