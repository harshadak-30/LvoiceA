"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MessageCircle, ThumbsUp, Clock, Mic } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VoiceAssistant } from "@/components/Chatbot"
export default function ForumsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)

  const popularTags = ["automation", "best practice", "integrations", "GraphQL API", "product feedback"]

  const discussions = [
    {
      id: 1,
      title: "How do I ensure that the supplier will only be able to edit their data and create an access password?",
      category: "Ask the Community",
      author: {
        name: "John Doe",
        avatar: "/placeholder.svg",
      },
      likes: 4,
      comments: 2,
      timeAgo: "4 hours ago",
      tags: ["Governance"],
    },
    {
      id: 2,
      title: "Introducing Improved Portal Editing: Enhancing Admin Capabilities",
      category: "News and Announcements",
      author: {
        name: "Lisa Martin",
        avatar: "/placeholder.svg",
      },
      likes: 7,
      comments: 3,
      timeAgo: "20 hours ago",
      tags: ["New Feature"],
    },
  ]

  return (
    <div className="min-h-screen bg-[#1a1f2c] relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-10 transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        <h1 className="text-4xl font-bold text-white mb-4">Discussions</h1>
        <p className="text-blue-300">Join the Digital Community</p>

        <div className="mt-6 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-0 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          <div className="lg:col-span-3 space-y-4">
            {discussions.map((discussion) => (
              <div key={discussion.id} className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={discussion.author.avatar} />
                    <AvatarFallback>{discussion.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{discussion.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{discussion.author.name}</span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" /> {discussion.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" /> {discussion.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {discussion.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Community Experts Leaderboard</h2>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Popular tags</h2>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isAssistantOpen && <VoiceAssistant onClose={() => setIsAssistantOpen(false)} />}
      <button
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-4 right-4 p-4 bg-purple-600 text-white rounded-full shadow-lg"
      >
        <Mic className="h-6 w-6" />
      </button>
    </div>
  )
}
