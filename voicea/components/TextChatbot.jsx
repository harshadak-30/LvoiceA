import React, { useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Mic } from "lucide-react";

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

const Chatbot = ({ onClose }) => {
  const [inputData, setInputData] = useState("");
  const [conversation, setConversation] = useState([
    { qns: "Hi", ans: "Hello, how can I help you?" },
  ]);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_API_KEY; 
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  const getData = async () => {
    if (!inputData.trim()) return;
    setLoading(true);

    const requestData = {
      contents: [{ parts: [{ text: inputData }] }],
    };

    try {
      const response = await axios.post(url, requestData, {
        headers: { "Content-Type": "application/json" },
      });

      const answer =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't understand that.";
      setConversation((prev) => [...prev, { qns: inputData, ans: answer }]);
      setInputData("");
    } catch (error) {
      console.error("Error fetching data:", error);
      setConversation((prev) => [
        ...prev,
        { qns: inputData, ans: "An error occurred while fetching data." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      getData();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bottom-20 right-0 w-96 bg-white"
      >
        <Card className="border-0">
          <div className="flex items-center justify-between p-4 ">
            <h3 className="font-semibold">Chatbot</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {conversation.map((chat, index) => (
              <div key={index} className="chat-entry mb-2">
                <p className="qns font-bold">Q: {chat.qns}</p>
                <div className="ans">
                  <strong>A:</strong> <ReactMarkdown>{chat.ans}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && <HashLoader loading={loading} size={20} color="#000000" />}
          </div>

          <div className="p-5 border-t flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 p-2 rounded-lg"
            />
            <Button onClick={getData}>Send</Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default Chatbot;
