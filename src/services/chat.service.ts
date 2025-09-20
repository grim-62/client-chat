import {api} from "@/services/api";
import { Friend, Message } from "@/types/friend";

export const ChatService = {
  // ✅ Get direct + group chats
  async getChats(): Promise<Friend[]> {
    const res = await api.get(`/chat/direct-chats`);
    return res.data;
  },

  // ✅ Get chat messages
  async getMessages(chatId: string): Promise<Message[]> {
    const res = await api.get(`/chat/${chatId}/messages`);
    return res.data;
  },

  // ✅ Send message (via REST, not socket)
  async sendMessage(chatId: string, message: string): Promise<Message> {
    const res = await api.post(`/chat/${chatId}/messages`, { message });
    return res.data;
  },

  // ✅ Friend requests
  async getFriendRequests(): Promise<Friend[]> {
    const res = await api.get("/friends/requests");
    return res.data;
  },

  async acceptFriendRequest(requestId: string) {
    return api.post(`/friends/requests/${requestId}/accept`);
  },

  async rejectFriendRequest(requestId: string) {
    return api.post(`/friends/requests/${requestId}/reject`);
  },

  // ✅ Groups
  async getGroups(userId: string) {
    const res = await api.get(`/groups/${userId}`);
    return res.data;
  },

  async createGroup(payload: { name: string; members: string[] }) {
    const res = await api.post("/groups", payload);
    return res.data;
  },
};
