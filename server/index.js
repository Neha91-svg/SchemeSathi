import dotenv from "dotenv";



import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
import fs from "fs";
import path from "path";


dotenv.config({
  path: path.resolve("server/.env")
});


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Routes
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/", (req, res) => res.send("SchemeSaathi backend running ✅"));

// Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
