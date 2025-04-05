"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { VoiceAssistant } from "@/components/Chatbot";
import { Mic } from "lucide-react";

export default function NetraPage() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false); // ✅ Added missing state

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">Welcome to Netra AI</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">On-Device AI Processing</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Utilizes ESP32 for offline recognition.</li>
              <li>Ensures privacy and fast processing.</li>
              <li>Operates without internet connectivity.</li>
            </ul>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">Cloud API Integration</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Real-time object and scene interpretation.</li>
              <li>Facial recognition for personalized interactions.</li>
              <li>Photo-to-voice descriptions and video summarization.</li>
            </ul>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">Educational Resources</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Access to a wide range of learning materials.</li>
              <li>Interactive tutorials and guides.</li>
              <li>Community forums for collaborative learning.</li>
            </ul>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">Sound-Based Visualization</h2>
            <ul className="list-disc list-inside text-gray-600">
              <li>Enhances accessibility through audio feedback.</li>
              <li>Supports visually impaired users.</li>
              <li>Innovative approach to learning and interaction.</li>
            </ul>
          </motion.div>
        </div>

        {/* Navigation Button */}
        <div className="text-center mt-12">
          <Link href="/educational-platform">
            <Button className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4">
              Let's Go to Our Educational Platform
            </Button>
          </Link>
        </div>
      </div>

      {/* Voice Assistant */}
      {isAssistantOpen && <VoiceAssistant onClose={() => setIsAssistantOpen(false)} />}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-purple-600 text-white rounded-full shadow-lg"
      >
        <Mic className="h-6 w-6" />
      </button>
    </div>
  );
}
