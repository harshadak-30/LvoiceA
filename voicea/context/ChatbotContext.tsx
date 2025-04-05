// context/ChatbotContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

interface ChatbotContextType {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

// Export ChatbotProvider as a named export
export const ChatbotProvider = ({ children }: { children: React.ReactNode }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <ChatbotContext.Provider value={{ isChatOpen, setIsChatOpen }}>
      {children}
    </ChatbotContext.Provider>
  );
};

// Export useChatbot as a named export
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};