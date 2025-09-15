import { useState } from "react";
import { api } from "@/services/api";
import { AuthService } from "@/services/auth.service";
import { userService } from "@/services/user.service";

interface SearchUser {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  isFriend?: boolean;
  requestSent?: boolean;
}

export function useSearchUsers() {
  const [isLoading, setIsLoading] = useState(false);

  const searchUsers = async (query: string): Promise<SearchUser[]> => {
    try {
      setIsLoading(true);
      const response = await userService.searchUser(query);
      console.log("Search response:", response);
      return response || [];
    } catch (error) {
      console.error("Failed to search users:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { searchUsers, isLoading };
}
