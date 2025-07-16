const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads/videos");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Enhanced Mongoose Video Schema
const Video = mongoose.model(
  "Video",
  new mongoose.Schema({
    title: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 100
    },
    description: { 
      type: String, 
      required: true,
      trim: true,
      maxlength: 500
    },
    videoUrl: { 
      type: String, 
      required: true 
    },
    originalFilename: { 
      type: String, 
      required: true 
    },
    fileSize: {
      type: Number,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    mimeType: {
      type: String,
      required: true
    }
  })
);

// Enhanced Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const ext = path.extname(file.originalname);
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  }
});

// File filter for video files only
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('❌ Invalid file type. Only video files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  }
});

// Upload Video Route (Save in DB)
router.post("/upload-video", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "❌ No video file uploaded" });
    }

    const { title, description } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ 
        error: "❌ Title and description are required" 
      });
    }

    const videoUrl = `/uploads/videos/${req.file.filename}`;
    
    const newVideo = new Video({
      title,
      description,
      videoUrl,
      originalFilename: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    await newVideo.save();
    
    res.status(201).json({
      message: "✅ Video uploaded successfully!",
      video: {
        id: newVideo._id,
        title: newVideo.title,
        description: newVideo.description,
        videoUrl: videoUrl,
        createdAt: newVideo.uploadedAt
      }
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "❌ Failed to save video" });
  }
});

// Get All Videos (Dynamic URL based on environment)
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadedAt: -1 });
    
    const baseUrl = process.env.BASE_URL || req.protocol + '://' + req.get('host');
    
    res.status(200).json(
      videos.map((video) => ({
        _id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: `${baseUrl}${video.videoUrl}`,
        originalFilename: video.originalFilename,
        fileSize: video.fileSize,
        uploadedAt: video.uploadedAt,
        mimeType: video.mimeType
      }))
    );
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "❌ Failed to fetch videos" });
  }
});

// Serve Videos Properly with Range Requests
router.get("/:filename", (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "❌ Video not found" });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // Parse Range header
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
      return;
    }

    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

// Delete Video Route (Remove from DB & Disk)
router.delete("/delete-video/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: "❌ Video not found" });
    }

    // Delete file from storage
    const filePath = path.join(__dirname, "..", video.videoUrl);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("File deletion error:", err);
        }
      });
    }

    // Delete from database
    await Video.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ 
      message: "✅ Video deleted successfully",
      deletedId: video._id
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "❌ Failed to delete video" });
  }
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    service: "video-service",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
