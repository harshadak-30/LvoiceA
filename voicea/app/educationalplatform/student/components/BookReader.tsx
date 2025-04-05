"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Play, Pause, StopCircle } from "lucide-react";
import { pdfjs } from "react-pdf";
import * as pdfjsLib from "pdfjs-dist";

// ✅ Fix PDF worker source
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function BookReader() {
  const [text, setText] = useState<string>("");
  const [isReading, setIsReading] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [speechQueue, setSpeechQueue] = useState<SpeechSynthesisUtterance[]>([]);
  const [currentUtteranceIndex, setCurrentUtteranceIndex] = useState<number>(0);

  // 📌 Handle File Upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type === "application/pdf") {
      await extractTextFromPDF(file);
    } else if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setText(e.target.result as string);
        }
      };
      reader.readAsText(file);
    } else {
      alert("❌ Please upload a PDF or TXT file.");
    }
  };

  // 📌 Extract text from PDF
  const extractTextFromPDF = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e.target?.result) {
          alert("No file data found.");
          return;
        }

        const typedArray = new Uint8Array(e.target.result as ArrayBuffer);
        const loadingTask = pdfjsLib.getDocument({ data: typedArray });

        loadingTask.promise
          .then(async (pdf) => {
            let extractedText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map((item: any) => item.str).join(" ");
              extractedText += pageText + " ";
            }

            setText(extractedText);
          })
          .catch(() => {
            alert("Error reading the PDF file.");
          });
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      alert("Failed to extract text from PDF.");
    }
  };

  // 📌 Start Reading
  const startReading = () => {
    if (!text) {
      alert("No text to read.");
      return;
    }

    speechSynthesis.cancel();
    setIsReading(true);
    setPaused(false);
    setCurrentUtteranceIndex(0);

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const utterances = sentences.map((sentence, index) => {
      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.onend = () => {
        if (index === sentences.length - 1) {
          setIsReading(false);
        } else {
          setCurrentUtteranceIndex(index + 1);
          speechSynthesis.speak(speechQueue[index + 1]);
        }
      };
      return utterance;
    });

    setSpeechQueue(utterances);
    if (utterances.length > 0) speechSynthesis.speak(utterances[0]);
  };

  // 📌 Pause Reading
  const pauseReading = () => {
    if (isReading) {
      speechSynthesis.pause();
      setPaused(true);
    }
  };

  // 📌 Resume Reading
  const resumeReading = () => {
    if (paused) {
      speechSynthesis.resume();
      setPaused(false);
    }
  };

  // 📌 Stop Reading
  const stopReading = () => {
    speechSynthesis.cancel();
    setIsReading(false);
    setPaused(false);
    setSpeechQueue([]);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">📖 Book Reader</h2>

      <div className="flex items-center justify-center gap-4 mb-4">
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileUpload}
          id="bookUpload"
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
      </div>

      {text && (
        <div className="p-4 bg-white rounded-lg shadow-md overflow-y-auto max-h-60">
          <p className="text-gray-700 text-sm whitespace-pre-line">{text.slice(0, 500)}...</p>
        </div>
      )}

      <div className="flex justify-center mt-4 gap-4">
        <Button onClick={startReading} className="bg-green-600 hover:bg-green-700 text-white flex gap-2">
          <Play size={18} /> Play
        </Button>
        <Button onClick={pauseReading} className="bg-yellow-500 hover:bg-yellow-600 text-white flex gap-2">
          <Pause size={18} /> Pause
        </Button>
        <Button onClick={resumeReading} className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2">
          🔄 Resume
        </Button>
        <Button onClick={stopReading} className="bg-red-600 hover:bg-red-700 text-white flex gap-2">
          <StopCircle size={18} /> Stop
        </Button>
      </div>
    </div>
  );
}
