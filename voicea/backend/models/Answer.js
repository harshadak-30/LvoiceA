const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  audioPath: { type: String } // This stores the audio file path
});

module.exports = mongoose.model("Answer", answerSchema);
