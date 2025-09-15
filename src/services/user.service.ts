import { api } from "./api";
import type { User } from "@/types/auth";

// Define types for friend requests and responses
export interface FriendRequest {
 success: boolean;
 message: string;
}

export interface Friend {
  id: string;
  user: User;
  friend: User;
  createdAt: string;
}

export const userService = {
  sendFriendRequest: (receiverId: string) => api.post<FriendRequest>(`/friends/${receiverId}/send`).then((r) => r.data),
  requestResponse: (requestId: string, accept: boolean) => api.post<FriendRequest>(`/friends/respond/${requestId}`, { accept }).then((r) => r.data),
  getNotification: () => api.get<FriendRequest[]>("/friends/pending").then((r) => r.data),
  searchUser: (q: string) => api.get<any[]>("/user/search", { params: { q } }).then((r) => r.data),
};

