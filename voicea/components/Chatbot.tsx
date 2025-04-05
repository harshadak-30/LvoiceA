"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Mic } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export function VoiceAssistant({ onClose }: { onClose: () => void }) {
  const navigationMap: Record<string, string> = {
    "go to home": "/",
    "go to about": "/about",
    "go to contact": "/contact",
    "go to forum": "/forums",
    "go to login": "/login",
    "go to sign up": "/signup",
    "go to voicea": "/voicea",
    "go to netra ai": "/netra",
    "go back": "Back to previous page",
  };

  const initialMessage = "Hello! I'm your voice assistant. Here are the available commands:";

  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    { text: initialMessage, isBot: true },
    {
      text: Object.keys(navigationMap)
        .map((cmd) => `• ${cmd}`)
        .join("\n"),
      isBot: true,
    },
  ]);

  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported in this browser.");
      return;
    }

    const recognizer = new SpeechRecognition();
    recognizer.continuous = false;
    recognizer.interimResults = false;
    recognizer.lang = "en-US";
    recognizer.onresult = handleSpeechResult;
    recognizer.onerror = handleSpeechError;
    setRecognition(recognizer);
  }, []);

  const handleSpeechResult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript;
    setMessages((prev) => [...prev, { text: transcript, isBot: false }]);
    processCommand(transcript);
  };

  const handleSpeechError = (event: SpeechRecognitionErrorEvent) => {
    console.error("Speech recognition error:", event.error);
    setMessages((prev) => [
      ...prev,
      { text: "Sorry, I couldn't understand that. Please try again.", isBot: true },
    ]);
  };

  const processCommand = (command: string) => {
    let response = "I'm not sure how to help with that.";
    const lowerCommand = command.toLowerCase();

    for (const key in navigationMap) {
      if (lowerCommand.includes(key)) {
        if (key === "go back") {
          window.history.back();
          response = navigationMap[key];
        } else {
          window.location.href = navigationMap[key];
          response = `Navigating to ${key.replace("go to ", "").replace("ai", "AI")} page.`;
        }
        break;
      }
    }

    setMessages((prev) => [...prev, { text: response, isBot: true }]);
    speak(response);
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (recognition) {
      if (!listening) {
        recognition.start();
        setListening(true);
      } else {
        recognition.stop();
        setListening(false);
      }
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages((prev) => [...prev, { text: inputText, isBot: false }]);
    processCommand(inputText);
    setInputText("");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl"
      >
        <Card className="border-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Voice Assistant</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {/* Chat Messages */}
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 whitespace-pre-line ${
                    message.isBot ? "bg-gray-100 text-gray-900" : "bg-purple-600 text-white"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <form onSubmit={handleTextSubmit} className="mb-4">
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit">Send</Button>
              </div>
            </form>

            <Button
              onClick={toggleListening}
              className="w-full flex items-center justify-center gap-2 focus:ring-0 focus:ring-offset-0"
              variant={listening ? "destructive" : "default"}
            >
              <Mic className="h-4 w-4" />
              {listening ? "Stop Listening" : "Start Listening"}
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
