"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VoiceAssistant } from "@/components/Chatbot";
import { Mic } from "lucide-react";

export default function QuestionAnswer() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.lang = "en-US";
        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          setTranscribedText(event.results[0][0].transcript);
        };
        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const startRecording = () => {
    if (recognition) {
      setIsRecording(true);
      setTranscribedText("");
      recognition.start();
    }
  };

  const stopRecording = () => {
    if (recognition) {
      setIsRecording(false);
      recognition.stop();
    }
  };

  const sendQuestion = async () => {
    if (!transcribedText.trim()) {
      alert("⚠ Please record a question first!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/questions/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: "student@example.com",
          question: transcribedText,
        }),
      });

      if (response.ok) {
        alert("✅ Question submitted successfully!");
        setTranscribedText("");
      }
    } catch (error) {
      console.error("❌ Error submitting question:", error);
    }
  };

  return (
    <div>
      <h2>Ask a Question</h2>
      <p>🎙️ Recorded Question: {transcribedText || "Waiting for input..."}</p>

      <Button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Stop Recording 🎤" : "Record Question 🎤"}
      </Button>

      <Button onClick={sendQuestion}>📩 Submit Question</Button>
    </div>
  );
}
