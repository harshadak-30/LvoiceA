const express = require("express");
const router = express.Router();
const Score = require("../models/Score");
const Quiz = require("../models/Quiz");

// Student submits quiz answers
router.post("/submit-quiz", async (req, res) => {
    try {
        const { studentName, quizId, answers } = req.body;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ error: "Quiz not found" });

        let score = 0;
        quiz.questions.forEach((q, index) => {
            if (q.answer === answers[index]) score++;
        });

        const newScore = new Score({ studentName, quizId, score });
        await newScore.save();
        res.status(200).json({ message: "Quiz submitted!", score });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit quiz" });
    }
});

// Get student scores
router.get("/get-scores/:studentName", async (req, res) => {
    try {
        const { studentName } = req.params;
        const scores = await Score.find({ studentName });
        res.status(200).json(scores);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch scores" });
    }
});

module.exports = router;
