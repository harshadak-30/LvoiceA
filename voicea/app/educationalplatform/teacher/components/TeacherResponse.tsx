"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const API_URL = "http://localhost:5000/api/questions";

export default function TeacherResponse() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [answer, setAnswer] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(API_URL);
      const unansweredQuestions = response.data.filter((q: any) => !q.answer); // Only unanswered
      setQuestions(unansweredQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to fetch questions. Please try again later.");
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedQuestion) return alert("Select a question first!");
    if (!answer.trim()) return alert("Answer cannot be empty!");
  
    setIsAnswering(true);
    setError("");
  
    try {
      const response = await axios.post(`${API_URL}/answer`, {
        questionId: selectedQuestion._id,
        answer,
        teacherEmail: "teacher@example.com", // Make sure to dynamically get the teacher's email
      });
  
      if (response.status === 200) {
        alert("✅ Answer submitted successfully!");
        setQuestions(questions.filter((q) => q._id !== selectedQuestion._id)); // Remove answered question
        setAnswer("");
        setSelectedQuestion(null);
      } else {
        throw new Error("Failed to submit answer");
      }
    } catch (error: any) {
      console.error("Error submitting answer:", error);
      setError(error.response?.data?.message || "❌ Submission failed. Please try again.");
    } finally {
      setIsAnswering(false);
    }
  };
  

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">
        Unanswered Questions
      </h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {questions.length === 0 ? (
        <p className="text-center text-gray-600 mt-2">No unanswered questions available.</p>
      ) : (
        <ul className="space-y-2">
          {questions.map((q) => (
            <li
              key={q._id}
              onClick={() => setSelectedQuestion(q)}
              className={`cursor-pointer p-3 rounded border ${
                selectedQuestion?._id === q._id ? "bg-blue-200 border-blue-400" : "bg-white border-gray-300"
              }`}
            >
              <p>{q.question}</p>
            </li>
          ))}
        </ul>
      )}

      {selectedQuestion && (
        <div className="mt-4">
          <h3 className="font-bold">Answering: {selectedQuestion.question}</h3>
          <textarea
            className="w-full p-2 border rounded mt-2"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
          />
          <Button className="mt-2" onClick={handleSubmitAnswer} disabled={isAnswering}>
            {isAnswering ? "Submitting..." : "Submit Answer"}
          </Button>
        </div>
      )}
    </div>
  );
}
