const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");


router.post("/publish-quiz", async (req, res) => {
  try {
    const { title } = req.body;

  
    const quiz = await Quiz.findOneAndUpdate({ title }, { published: true });

    if (quiz) {
      res.json({ success: true, message: "Quiz published successfully!" });
    } else {
      res.json({ success: false, message: "Quiz not found!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "❌ Error publishing quiz" });
  }
});


router.get("/get-quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

module.exports = router;
