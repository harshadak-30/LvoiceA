const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
    title: String,
    questions: [
        {
            question: String,
            options: [String],
            answer: String,
        },
    ],
});

// Avoid overwriting the model
module.exports = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
