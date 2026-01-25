import express from "express";
import { uploadPDF } from "../controllers/uploadController.js";
import multer from "multer";

const router = express.Router();

// Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});
const upload = multer({ storage });

router.post("/", upload.single("file"), uploadPDF);

export default router;
