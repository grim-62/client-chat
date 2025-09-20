import { useState, useEffect } from "react"
import { api } from "@/services/api"

interface ChatMember {
  _id: string
  username: string
  avatar?: string
  isOnline?: boolean
}

interface LastMessage {
  content: string
  createdAt: string
  sender: {
    _id: string
    username: string
  }
}

interface Chat {
  _id: string
  name?: string
  members: ChatMember[]
  groupChat: boolean
  avatar?: string
  lastMessage?: LastMessage
  unreadCount: number
  createdAt: string
}

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setIsLoading(true)
        const response = await api.get("/chats")
        setChats(response.data.chats || [])
      } catch (error) {
        console.error("Failed to fetch chats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChats()
  }, [])

  const addChat = (chat: Chat) => {
    setChats(prev => [chat, ...prev])
  }

  const updateChat = (chatId: string, updates: Partial<Chat>) => {
    setChats(prev => prev.map(chat => 
      chat._id === chatId ? { ...chat, ...updates } : chat
    ))
  }

  const removeChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat._id !== chatId))
  }

  return { chats, isLoading, addChat, updateChat, removeChat }
}
