import { CreateGroupChatDto } from "@/types/chat";
import { api } from "./api";
import type { User } from "@/types/auth";
import { get } from "http";



export const chatService = {
  createGroupChat: (dto: CreateGroupChatDto) => api.post<any>(`/chat/group`, dto).then((r) => r.data),
  requestResponse: (requestId: string, accept: boolean) => api.post(`/friends/respond/${requestId}`, { accept }).then((r) => r.data),
  getNotification: () => api.get("/friends/pending-requests").then((r) => r.data),
  getFriendsList: () => api.get<any>("/chat/direct-chats").then((r) => r.data),
};
