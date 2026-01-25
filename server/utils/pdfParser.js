import fs from "fs";

export const parsePDF = async (filePath) => {
  try {
    console.log("Reading PDF from:", filePath);
    
    // Import the Node.js version
    const { default: pdfjs } = await import('pdfjs-dist');
    
    // Specifically use the Node.js build
    const pdfjsLib = pdfjs;
    
    // Read the PDF file
    const dataBuffer = fs.readFileSync(filePath);
    console.log("PDF file size:", dataBuffer.length, "bytes");
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: dataBuffer,
      verbosity: 0,
      isEvalSupported: false,
      useSystemFonts: true
    });
    
    const pdf = await loadingTask.promise;
    console.log("PDF loaded. Number of pages:", pdf.numPages);
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    console.log("Total text extracted:", fullText.length, "characters");
    
    if (fullText.trim().length === 0) {
      console.warn("Warning: No text content found in PDF");
      return "";
    }
    
    return fullText;
  } catch (error) {
    console.error("Error parsing PDF:", error.message);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};