const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
    studentName: String,
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
    score: Number,
});

// Avoid overwriting the model
module.exports = mongoose.models.Score || mongoose.model("Score", ScoreSchema);
