import path from "path";
import * as MulterUtil from "../utils/multer.ts";
import { Router } from "express";
import { getVideoDuration } from "../utils/ffmpeg.ts";
import fs from 'fs';

const router = Router();

router.post("/upload-video", MulterUtil.uploadVideo.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video uploaded" });
    }

    // Full paths
    const userUploadPath = path.join(
      process.cwd(),
      "server/public/videos/useruploads",
      req.file.filename
    );

    const templateVideoPath = path.join(
      process.cwd(),
      "server/remotion_templates/TemplateHolder/public/videos",
      req.file.filename
    );

    // Ensure template dir exists
    fs.mkdirSync(path.dirname(templateVideoPath), { recursive: true });

    // Copy into both dirs
    fs.copyFileSync(userUploadPath, templateVideoPath);

    // ✅ Get duration (async)
    const durationSeconds = await getVideoDuration(userUploadPath);

    // Public URL (served from /public)
    const videoUrl = `/defaultvideos/useruploads/${req.file.filename}`;

    console.log("✅ Video uploaded:", {
      videoUrl,
      durationSeconds,
      size: req.file.size,
    });

    res.json({
      url: videoUrl,
      filename: req.file.filename,
      size: req.file.size,
      durationSeconds,
    });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    res.status(500).json({ error: "Upload failed", details: String(error) });
  }
});

// Image upload route
router.post("/upload-image", MulterUtil.upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `http://localhost:3000/images/${req.file.filename}`;

    console.log("✅ Image uploaded successfully:", imageUrl);

    res.json({
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (error) {
    console.error("❌ Image upload failed:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

router.post("/upload-kenburns-image", MulterUtil.uploadKenBurns.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `/kenburnsimages/${req.file.filename}`;

    console.log("✅ KenBurns image uploaded:", imageUrl);

    res.json({
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// ✅ Multiple images (folder or multi-select upload)
router.post(
  "/upload-kenburns-folder",
  MulterUtil.uploadKenBurns.array("images"), // max 5 images
  (req, res) => {
    try {
      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const files = req.files as Express.Multer.File[];

      const uploadedUrls = files.map((file) => ({
        url: `/kenburnsimages/${file.filename}`,
        filename: file.filename,
        size: file.size,
      }));

      console.log("✅ KenBurns folder uploaded:", uploadedUrls);

      res.json({ images: uploadedUrls });
    } catch (error) {
      console.error("❌ Folder upload failed:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  }
);


export default router;