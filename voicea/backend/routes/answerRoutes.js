const express = require("express");
const Answer = require("../models/Answer");
const Question = require("../models/Question");

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const { studentEmail } = req.query;

    if (!studentEmail) {
      return res.status(400).json({ message: "Student email is required" });
    }


    const textAnswers = await Answer.find({ studentEmail });
    const questionAnswers = await Question.find({
      studentEmail,
      answer: { $ne: "" },
    });

    const allAnswers = [
      ...textAnswers.map(a => ({
        question: a.question,
        answer: a.answer,
        audioPath: a.audioPath
      })),
      ...questionAnswers.map(q => ({
        question: q.question,
        answer: q.answer,
        audioPath: q.answerAudio
      }))
    ];

    res.json(allAnswers);
  } catch (error) {
    console.error("❌ Error fetching answers:", error);
    res.status(500).json({ message: "Error fetching answers" });
  }
});

module.exports = router;
