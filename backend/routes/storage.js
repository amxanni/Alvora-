import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const fileType = file.mimetype;
    let resourceType = "auto";
    let folderName = "alvora-uploads";

    if (fileType === "application/pdf" || 
        fileType === "application/zip" || 
        fileType === "application/x-zip-compressed" ||
        fileType.includes("compressed") || 
        fileType.includes("archive")) {
      resourceType = "raw";
    }

    return {
      folder: folderName,
      allowed_formats: ["jpg", "png", "jpeg", "pdf", "doc", "docx", "txt", "xls", "xlsx", "ppt", "pptx", "zip", "rar", "7z"],
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`, 
    };
  },
});

const upload = multer({ storage: storage });

// UPLOAD FILE
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided." });
    }
    
    res.json({
      message: "File uploaded successfully.",
      url: req.file.path,
      name: req.file.originalname,
    });
  } catch (err) {
    console.error("Upload file error:", err);
    res.status(500).json({ message: "Failed to upload file." });
  }
});

export default router;
