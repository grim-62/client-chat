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
  chatName: string
  users: ChatMember[]
  isGroup: boolean
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
        const response = await api.get("/chat/group-chats")
        setChats(response.data || [])
      } catch (error) {
        console.error("Failed to fetch chats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChats()
  }, [])

  return { chats, isLoading  }
}
