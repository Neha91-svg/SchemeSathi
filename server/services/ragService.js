// services/ragService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment or use a test key
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyD_TEST_KEY_REPLACE_ME"; // Replace with your actual key
const genAI = new GoogleGenerativeAI(apiKey);

export const processRAG = async (text) => {
  try {
    console.log("Using Gemini API with text length:", text.length);

    // Use the correct model name - gemini-1.0-pro or gemini-pro
    const model = genAI.getGenerativeModel({
      model: "Gemini 2.5 Flash‑Lite"  // Changed from "gemini-pro"
    });

    // Truncate text to avoid token limits
    const truncatedText = text.length > 10000 ? text.substring(0, 10000) + "..." : text;

    const prompt = `Analyze this government scheme document and provide:
1. A comprehensive summary (about 200 words)
2. ELI10 (Explain Like I'm 10) version in simple terms (about 100 words)

Document content:
${truncatedText}

Please format your response as a valid JSON object with these exact keys:
{
  "summary": "detailed summary here",
  "eli10": "simple explanation here"
}

Return ONLY the JSON object, no additional text.`;

    console.log("Sending request to Gemini API...");

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log("Gemini response received:", responseText.substring(0, 200));

    // Clean the response text
    let cleanText = responseText.trim();

    // Remove markdown code blocks if present
    cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

    // Try to parse JSON
    try {
      const parsedResponse = JSON.parse(cleanText);
      return parsedResponse;
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
      console.error("Raw response:", cleanText);

      // Fallback: return as plain text
      return {
        summary: cleanText,
        eli10: "Simplified explanation could not be generated. Please see the summary above."
      };
    }

  } catch (error) {
    console.error("Gemini API error details:", error.message);

    // Check for specific errors
    if (error.message.includes("API key")) {
      throw new Error("Invalid or missing Gemini API key. Please set GEMINI_API_KEY in .env file.");
    } else if (error.message.includes("404") || error.message.includes("not found")) {
      throw new Error("Gemini model not found. Try using 'gemini-1.0-pro' or 'gemini-pro'.");
    } else if (error.message.includes("quota") || error.message.includes("429")) {
      throw new Error("Gemini API quota exceeded. Please check your Google AI Studio account.");
    }

    // Fallback to mock response for development
    console.log("Falling back to mock response for development...");

    // Mock response for testing
    const mockResponse = {
      summary: `Document successfully parsed (${text.length} characters). For AI analysis, please configure a valid API key. Key points extracted from text.`,
      eli10: `This is a government scheme document. It contains important information about benefits and eligibility criteria. Please configure AI API for detailed analysis.`
    };

    return mockResponse;

    // Or throw error: throw new Error(`AI processing failed: ${error.message}`);
  }
};