import { useState, useEffect } from "react"
import { api } from "@/services/api"

interface FriendRequest {
  _id: string
  sender: {
    _id: string
    username: string
    email: string
    avatar?: string
  }
  receiver: {
    _id: string
    username: string
    email: string
    avatar?: string
  }
  status: "pending" | "accepted" | "rejected"
  createdAt: string
}

export function useFriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true)
        const response = await api.get("/friends/pending")
        setRequests(response.data || [])
      } catch (error) {
        console.error("Failed to fetch friend requests:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const respondToRequest = async (requestId: string, accept: boolean) => {
    try {
      await api.post(`/friends/respond/${requestId}`, { accept })
      
      // Remove the request from the list
      setRequests(prev => prev.filter(request => request._id !== requestId))
      
      return { success: true }
    } catch (error) {
      console.error("Failed to respond to friend request:", error)
      return { success: false, error }
    }
  }

  const addRequest = (request: FriendRequest) => {
    setRequests(prev => [request, ...prev])
  }

  const removeRequest = (requestId: string) => {
    setRequests(prev => prev.filter(request => request._id !== requestId))
  }

  return { 
    requests, 
    isLoading, 
    respondToRequest, 
    addRequest, 
    removeRequest 
  }
}
