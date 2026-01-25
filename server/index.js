import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/uploadRoutes.js";
import fs from "fs";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => res.send("SchemeSaathi backend running ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
