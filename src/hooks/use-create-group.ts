import { useState } from "react"
import { api } from "@/services/api"

interface CreateGroupPayload {
  name: string
  users: string[]
}

export function useCreateGroup() {
  const [isLoading, setIsLoading] = useState(false)

  const createGroup = async (payload: CreateGroupPayload) => {
    try {
      setIsLoading(true)
      const response = await api.post("/chat/group", payload)
      
      if (response.data.success) {
        return { success: true, chat: response.data.chat }
      }
      
      return { success: false, error: "Failed to create group" }
    } catch (error: any) {
      console.error("Failed to create group:", error)
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to create group" 
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { createGroup, isLoading }
}
