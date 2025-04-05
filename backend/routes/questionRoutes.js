const express = require("express");
const multer = require("multer");
const Question = require("../models/Question");
const Answer = require("../models/Answer");

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post("/ask-question", upload.single("audio"), async (req, res) => {
  try {
    const { studentEmail, question } = req.body;
    const audio = req.file ? req.file.buffer.toString("base64") : null;

    if (!studentEmail || (!question && !audio)) {
      return res.status(400).json({ message: "Text or audio question is required" });
    }

    const newQuestion = new Question({
      studentEmail,
      question,
      audio,
      answer: "",
      answerAudio: "",
    });

    await newQuestion.save();
    console.log("✅ New Question Saved:", newQuestion);

    res.status(201).json({ message: "Question submitted successfully!" });
  } catch (error) {
    console.error("❌ Error submitting question:", error);
    res.status(500).json({ message: "Error submitting question" });
  }
});


router.get("/", async (req, res) => {
  try {
    const questions = await Question.find({ answer: "" }, { answer: 0, answerAudio: 0 });

    res.json(questions);
  } catch (error) {
    console.error("❌ Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions" });
  }
});

module.exports = router;
