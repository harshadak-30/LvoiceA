"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import UploadVideo from "./components/UploadVideo";
import TeacherResponse from "./components/TeacherResponse";
import UploadQuiz from "./components/UploadQuiz";
import ViewMarks from "./components/ViewMarks";
import ViewAssignment from "./components/ViewAssignment";
import { VoiceAssistant } from "@/components/Chatbot";
import { Mic } from "lucide-react";

export default function TeacherDashboard() {
  const [activeModal, setActiveModal] = useState<"video" | "response" | "quiz" | "marks" | "assignments" | null>(null);
  const [user, setUser] = useState<{ email: string; userType: string } | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

    if (!loggedInUser || loggedInUser.userType !== "teacher") {
      router.push("/login");
    } else {
      setUser(loggedInUser);
    }
  }, [router]);

  const openModal = (type: "video" | "response" | "quiz" | "marks" | "assignments") => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    router.push("/login");
  };

  return (
    <div className={`min-h-screen bg-gray-100 py-12 relative ${activeModal ? "overflow-hidden" : ""}`}>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-purple-600">Welcome, {user?.email || "Teacher"}</h2>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <p className="text-center text-gray-600 mb-10">
          Manage your educational resources efficiently.
        </p>

        {/* Feature Highlights */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: "🎥", title: "Upload Video", desc: "Upload videos for students", action: () => openModal("video") },
            { icon: "📝", title: "Answer Questions", desc: "Respond to student queries", action: () => openModal("response") },
            { icon: "📚", title: "Upload Quiz", desc: "Create and upload quizzes", action: () => openModal("quiz") },
            { icon: "📊", title: "View Marks", desc: "Check student performance", action: () => openModal("marks") },
            { icon: "📂", title: "View Assignments", desc: "Review student assignments", action: () => openModal("assignments") },
          ].map(({ icon, title, desc, action }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center cursor-pointer hover:bg-gray-100 transform hover:scale-105 transition-all"
              onClick={action}
            >
              <div className="text-5xl mb-3">{icon}</div>
              <h3 className="text-2xl font-bold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative max-h-[90vh] overflow-auto"
            >
              <h3 className="text-2xl font-bold text-purple-600 mb-4 text-center">
                {activeModal === "video"
                  ? "Upload a Video"
                  : activeModal === "response"
                  ? "Answer Student Questions"
                  : activeModal === "quiz"
                  ? "Upload a Quiz"
                  : activeModal === "marks"
                  ? "View Student Marks"
                  : "View Assignments"}
              </h3>

              {activeModal === "video" && <UploadVideo />}
              {activeModal === "response" && <TeacherResponse />}
              {activeModal === "quiz" && <UploadQuiz />}
              {activeModal === "marks" && <ViewMarks />}
              {activeModal === "assignments" && <ViewAssignment />}

              <div className="flex justify-center mt-4">
                <Button className="bg-red-600 hover:bg-red-700" onClick={closeModal}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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