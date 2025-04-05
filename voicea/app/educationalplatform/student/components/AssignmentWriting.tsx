"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Download } from "lucide-react";
import html2pdf from "html2pdf.js";

export default function AssignmentWriting() {
  const [text, setText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setText(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
    setRecognition(recognition);
  };

  // Stop speech recognition
  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Download text as PDF
  const downloadAsPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = `<h1>Assignment</h1><p>${text}</p>`;
    html2pdf()
      .from(element)
      .save("assignment.pdf");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h4 className="text-lg font-semibold mb-4">Write and Submit Assignments</h4>

      {/* Textarea for displaying converted text */}
      <textarea
        className="w-full p-3 border rounded-lg mb-4"
        placeholder="Write your assignment here..."
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* Buttons for audio input and PDF download */}
      <div className="flex gap-4">
        <Button
          className={`flex items-center gap-2 ${isListening ? "bg-red-600" : "bg-purple-600"}`}
          onClick={isListening ? stopListening : startListening}
        >
          <Mic size={18} />
          {isListening ? "Stop Recording" : "Start Recording"}
        </Button>

        <Button
          className="flex items-center gap-2 bg-green-600"
          onClick={downloadAsPDF}
          disabled={!text.trim()}
        >
          <Download size={18} />
          Download as PDF
        </Button>
      </div>
    </div>
  );
}