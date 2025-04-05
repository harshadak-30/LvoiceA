const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const router = express.Router();

// ✅ Ensure `uploads/videos/` directory exists
const uploadDir = path.join(__dirname, "../uploads/videos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Mongoose Video Schema
const Video = mongoose.model(
  "Video",
  new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true }, // Store video path
  })
);

// ✅ Multer Storage Setup (Retain File Extensions)
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ Serve Uploaded Videos as Static Files
router.use("/uploads/videos", express.static(uploadDir));

// ✅ Upload Video Route (Save in DB)
router.post("/upload-video", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "❌ No video file uploaded" });
    }

    const { title, description } = req.body;
    const videoUrl = `/uploads/videos/${req.file.filename}`;

    const newVideo = new Video({ title, description, videoUrl });
    await newVideo.save();

    res.status(201).json({
      message: "✅ Video uploaded successfully!",
      video: newVideo,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "❌ Failed to save video" });
  }
});

// ✅ Get All Videos (Correct URL Formatting)
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(
      videos.map((video) => ({
        _id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: `http://localhost:5000${video.videoUrl}`,
      }))
    );
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "❌ Failed to fetch videos" });
  }
});

// ✅ Serve Videos Properly
router.get("/:filename", (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "❌ Video not found" });
  }

  res.setHeader("Content-Type", "video/mp4");
  fs.createReadStream(filePath).pipe(res);
});

// ✅ Delete Video Route (Remove from DB & Disk)
router.delete("/delete-video/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: "❌ Video not found" });
    }

    const filePath = path.join(__dirname, "..", video.videoUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete from storage
    }

    await Video.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "✅ Video deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "❌ Failed to delete video" });
  }
});

module.exports = router;
