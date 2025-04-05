"use client";

import React, { useState, useRef, useEffect } from "react";

interface Reminder {
  text: string;
  time: string; // Stored as ISO string
}

const VoiceNoteTaker: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [note, setNote] = useState<string>("");
  const [notes, setNotes] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [reminderText, setReminderText] = useState<string>("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("voiceNotes") || "[]");
    const savedReminders = JSON.parse(localStorage.getItem("reminders") || "[]");
    setNotes(savedNotes);
    setReminders(savedReminders);
  }, []);

  useEffect(() => {
    localStorage.setItem("voiceNotes", JSON.stringify(notes));
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [notes, reminders]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date().toISOString();
      reminders.forEach((reminder, index) => {
        if (reminder.time <= now) {
          const utterance = new SpeechSynthesisUtterance(`Reminder: ${reminder.text}`);
          window.speechSynthesis.speak(utterance);

          // Remove the reminder after triggering
          setReminders((prev) => prev.filter((_, i) => i !== index));
        }
      });
    };

    const interval = setInterval(checkReminders, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [reminders]);

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onstart = () => setIsRecording(true);
    recognitionRef.current.onend = () => setIsRecording(false);
    
    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }
      setNote(transcript);
    };

    recognitionRef.current.start();
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
  };

  const saveNote = () => {
    if (note.trim()) {
      setNotes([...notes, note]);
      setNote("");
    }
  };

  const deleteNote = (index: number) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const addReminder = () => {
    if (reminderText.trim()) {
      const timeInput = prompt("Enter reminder time (HH:MM 24-hour format):");
      if (timeInput) {
        const [hours, minutes] = timeInput.split(":").map(Number);
        if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
          const now = new Date();
          now.setHours(hours, minutes, 0, 0);
          setReminders([...reminders, { text: reminderText, time: now.toISOString() }]);
          setReminderText("");
        } else {
          alert("Invalid time format. Please enter HH:MM in 24-hour format.");
        }
      }
    }
  };

  const deleteReminder = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  if (!isVisible) return null; // Hide the box when closed

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-400 to-purple-500 p-6 relative">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg text-center relative">
        
        {/* Close Button */}
        <button 
          className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          onClick={() => setIsVisible(false)}
        >
          ✖
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Voice-Controlled Notes & Reminders</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Take a Voice Note</h3>
        <div className="mb-4 p-4 border rounded bg-gray-100 h-40 overflow-auto text-gray-700">
          {note || "Start speaking to take notes..."}
        </div>
        <button
          className={`px-4 py-2 rounded text-white ${isRecording ? "bg-red-500" : "bg-blue-500"}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <button className="ml-2 px-4 py-2 bg-green-500 text-white rounded" onClick={saveNote} disabled={!note.trim()}>
          Save Note
        </button>
      </div>

      <div className="mt-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Saved Notes</h3>
        <div className="grid gap-4">
          {notes.map((savedNote, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
              <span className="text-gray-800">{savedNote}</span>
              <div>
                <button className="text-blue-500 mr-2" onClick={() => playAudio(savedNote)}>▶</button>
                <button className="text-red-500" onClick={() => deleteNote(index)}>✖</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Reminders</h3>
        <div className="grid gap-4">
          {reminders.map((reminder, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
              <span className="text-gray-800">{reminder.text} at {new Date(reminder.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <button className="text-red-500" onClick={() => deleteReminder(index)}>✖</button>
            </div>
          ))}
        </div>
        <input
          className="mt-4 p-2 rounded text-gray-800"
          type="text"
          placeholder="Reminder text..."
          value={reminderText}
          onChange={(e) => setReminderText(e.target.value)}
        />
        <button className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded" onClick={addReminder}>
          Add Reminder
        </button>
      </div>
    </div>
  );
};

export default VoiceNoteTaker;
