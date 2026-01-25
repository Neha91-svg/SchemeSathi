import fs from "fs";

export const parsePDF = async (filePath) => {
  const pdf = await import("pdf-parse"); // dynamic import
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf.default(dataBuffer); // note: .default
  return data.text; // full text
};
