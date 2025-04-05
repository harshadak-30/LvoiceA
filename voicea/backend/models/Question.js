const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  teacherEmail: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Question", QuestionSchema);
