"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import Chatbot  from "@/components/TextChatbot";
import { VoiceAssistant } from "@/components/Chatbot";
import { Mic, Sun, Moon, Search, MessageCircle } from "lucide-react"; 
import Image from "next/image";
import Typewriter from "typewriter-effect";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); 
  const [highlightAuth, setHighlightAuth] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleTryNowClick = () => {
    setHighlightAuth(true);
    setTimeout(() => setHighlightAuth(false), 3000);
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white"} min-h-screen`}>
      
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-md backdrop-blur-md z-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              Perceiva
            </Link>
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search forums..."
                  className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 dark:bg-gray-700 dark:text-white"
                />
                <Search className="absolute right-3 top-3 text-gray-500 dark:text-gray-300" />
              </div>
              <Link href="/forums" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition">
                Forums
              </Link>
              <Link href="/login">
                <Button className={`transition-all px-5 py-2 ${highlightAuth ? "bg-red-500 scale-110" : ""}`}>
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-purple-600 hover:bg-purple-700 px-5 py-2 transition-all">
                  Sign Up
                </Button>
              </Link>
              {/* Dark Mode Toggle */}
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-gray-200 rounded-lg dark:bg-gray-700">
                {darkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-800" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-32 flex flex-col items-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-xl max-w-3xl text-center backdrop-blur-lg"
        >
          {/* Educational Illustration */}
          <Image src="/images/education.jpeg" width={250} height={200} alt="Education Icon" className="mx-auto mb-4" />
          
          <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            <Typewriter
              options={{
                strings: ["Voicea", "Smart Learning", "Inclusive Education"],
                autoStart: true,
                loop: true,
                delay: 100,
                deleteSpeed: 50,
              }}
            />
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
            Voicea focuses on revolutionizing inclusive digital learning for specially-abled individuals.
            It provides real-time, AI-driven solutions for accessible education through sound-based feedback
            and community interaction...
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-xl px-10 py-6 rounded-lg shadow-lg" onClick={handleTryNowClick}>
            Try Now
          </Button>
        </motion.div>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md backdrop-blur-lg"
          >
            <h3 className="text-xl font-semibold text-purple-600">AI-Powered Learning</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Adaptive and smart recommendations for users.</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md backdrop-blur-lg"
          >
            <h3 className="text-xl font-semibold text-purple-600">Multi-Sensory Engagement</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Audio, visual, and haptic feedback integration.</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md backdrop-blur-lg"
          >
            <h3 className="text-xl font-semibold text-purple-600">Community Forum</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Connect and discuss with other learners.</p>
          </motion.div>
        </div>
               {/* Video Section */}
        <div className="mt-12 w-full max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Learn More About Voicea</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Watch this video to understand how Voicea enhances accessible education for specially-abled individuals.
          </p>
          <div className="relative w-full h-[600px]">
            <video className="w-full h-full rounded-lg shadow-lg" autoPlay muted playsInline loop controls>
              <source src="/videos/intro1.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Voice Assistant Modal */}
        {isAssistantOpen && (
          <div className="fixed bottom-20 right-6 p-6 bg-gray-800 text-white rounded-lg shadow-2xl border border-gray-600">
            <VoiceAssistant onClose={() => setIsAssistantOpen(false)} />
          </div>
        )}
        {/* Text Chatbot Modal */}
        
        {isChatbotOpen && ( 
  <div className="fixed bottom-40 right-8 p-6 rounded-lg shadow-2xl border border-gray-600 bg-transparent">
    <Chatbot onClose={() => setIsChatbotOpen(false)} />
  </div>
)}

        
       {/* Voice Assistant Button */}
<button
  onClick={() => setIsAssistantOpen(true)}
  className="fixed bottom-6 right-6 p-5 bg-purple-600 text-white rounded-full shadow-xl hover:bg-purple-700 transition"
>
  <Mic className="h-7 w-7" />
</button>
{/* Text-Based Chatbot Button */}
<button
  onClick={() => setIsChatbotOpen(true)}
  className="fixed bottom-28 right-6 p-0  rounded-full  shadow-xl transition"
>
  <Image 
    src="/image.png" 
    alt="Chatbot Icon" 
    width={60} 
    height={60} 
  />
</button>



      </div>
    </div>
  );
}
