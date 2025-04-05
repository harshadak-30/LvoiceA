"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VoiceAssistant } from "@/components/Chatbot";
import { Mic } from "lucide-react";

export default function VoiceaPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; userType: string } | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false); // ✅ Fixed missing state

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

      if (!storedUser) {
        router.push("/login"); // Redirect if user is not logged in
      } else {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, [router]);

  // ✅ Allow both students & teachers to enter their dashboards
  const handleEnterPlatform = () => {
    console.log("Redirecting user:", user); // ✅ Debugging line
    if (user?.userType === "student") {
      router.push("/educationalplatform/student"); // ✅ Redirect students
    } else if (user?.userType === "teacher") {
      router.push("/educationalplatform/teacher"); // ✅ Redirect teachers
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h2 className="text-4xl font-bold text-center text-purple-600 mb-8">Discover Voicea</h2>
        <p className="text-center text-gray-600 mb-12">
          Voicea is revolutionizing inclusive digital learning for specially-abled individuals. 
          Explore the features below to understand how Voicea can enhance accessibility and learning.
        </p>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: "🔊", title: "Sound-Based Feedback", desc: "Provides real-time audio feedback for better learning." },
            { icon: "📚", title: "Personalized Learning", desc: "Offers tailored resources to meet individual needs." },
            { icon: "🤝", title: "Community Interaction", desc: "Facilitates collaborative learning through forums." },
            { icon: "🌍", title: "Multi-Language Support", desc: "Ensures accessibility for a global audience." },
            { icon: "🖥️", title: "Assistive Technology Integration", desc: "Seamlessly integrates with existing assistive tools." },
          ].map(({ icon, title, desc }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <div className="text-5xl mb-4">{icon}</div>
              <h3 className="text-2xl font-bold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Navigation Button */}
        <div className="text-center mt-12">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4"
            onClick={handleEnterPlatform}
          >
            Welcome to Our Educational Platform
          </Button>
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
