import { useState, useEffect } from "react"
import { api } from "@/services/api"
import { ChatService } from "@/services/chat.service"
import { Friend } from "@/types/friend"

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoading(true)
        const response = await ChatService.getChats()
        setFriends(response as Friend[] || [])
      } catch (error) {
        console.error("Failed to fetch friends:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFriends()
  }, [])

  const addFriend = (friend: Friend) => {
    setFriends(prev => [friend, ...prev])
  }

  const removeFriend = (friendId: string) => {
    setFriends(prev => prev.filter(friend => friend._id !== friendId))
  }

  const updateFriendStatus = (friendId: string, isOnline: boolean) => {
    setFriends(prev => prev.map(friend => 
      friend._id === friendId ? { ...friend, isOnline } : friend
    ))
  }

  return { friends, isLoading, addFriend, removeFriend, updateFriendStatus }
}
