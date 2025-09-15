import { useState } from "react"
import { api } from "@/services/api"
import { toast } from "sonner"
import { userService } from "@/services/user.service"

export function useSendFriendRequest() {
  const [isLoading, setIsLoading] = useState(false)

  const sendFriendRequest = async (receiverId: string) => {
    try {
      setIsLoading(true)
      const response = await api.post(`/friends/${receiverId}/send`)
      if (response.data.success) {
        toast.success(response.data.message)
        return { success: true }
      }
    } catch (error: any) {
      console.error("Failed to send friend request:", error)
      toast.error(error.response.data.message )
      return { 
        success: false, 
        error: error.response?.data?.message || "Failed to send friend request" 
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { sendFriendRequest, isLoading }
}