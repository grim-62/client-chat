import { useEffect, useState } from "react";
import { initSocket, getSocket } from "@/lib/socket";
import {
  SOCKET_EVENT_NEW_MESSAGE,
  SOCKET_EVENT_NEW_MESSAGE_ALERT,
  SOCKET_EVENT_TYPING_START,
  SOCKET_EVENT_TYPING_END,
  SOCKET_EVENT_ONLINE_USERS,
} from "@/constants/constants";
import { v4 as uuid } from "uuid";

interface Message {
  _id: string;
  content: string;
  sender: { _id: string; name: string };
  chat: string;
  createdAt: string;
}

export const useChat = (user: { _id: string; username: string }, chatId: string, members: string[]) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const socket = initSocket(user._id);

    // 🔹 Listen for new messages
    socket.on(SOCKET_EVENT_NEW_MESSAGE, ({ message, chatId: incomingChatId }) => {
      if (incomingChatId === chatId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // 🔹 Alerts (unread badges, notifications, etc.)
    socket.on(SOCKET_EVENT_NEW_MESSAGE_ALERT, ({ chatId: incomingChatId }) => {
      if (incomingChatId !== chatId) {
        console.log("New message in another chat:", incomingChatId);
      }
    });

    // 🔹 Typing indicators
    socket.on(SOCKET_EVENT_TYPING_START, ({ chatId: incomingChatId, user: typingUser }) => {
      if (incomingChatId === chatId && typingUser !== user._id) {
        setIsTyping(typingUser);
      }
    });

    socket.on(SOCKET_EVENT_TYPING_END, ({ chatId: incomingChatId, user: typingUser }) => {
      if (incomingChatId === chatId && typingUser === isTyping) {
        setIsTyping(null);
      }
    });

    // 🔹 Online users
    socket.on(SOCKET_EVENT_ONLINE_USERS, ({ onlineUsers }) => {
      setOnlineUsers(onlineUsers);
    });

    return () => {
      socket.off(SOCKET_EVENT_NEW_MESSAGE);
      socket.off(SOCKET_EVENT_NEW_MESSAGE_ALERT);
      socket.off(SOCKET_EVENT_TYPING_START);
      socket.off(SOCKET_EVENT_TYPING_END);
      socket.off(SOCKET_EVENT_ONLINE_USERS);
    };
  }, [user._id, chatId]);

  // 🔹 Emit new message
  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const socket = getSocket();
    socket.emit(SOCKET_EVENT_NEW_MESSAGE, {
      chatId,
      message: content,
      members,
      sender: { _id: user._id, name: user.username },
    });

    // Optimistic UI update
    setMessages((prev) => [
      ...prev,
      {
        _id: uuid(),
        content,
        sender: { _id: user._id, name: user.username },
        chat: chatId,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  // 🔹 Typing events
  const startTyping = () => {
    getSocket().emit(SOCKET_EVENT_TYPING_START, { chatId, members, senderId: user._id });
  };

  const stopTyping = () => {
    getSocket().emit(SOCKET_EVENT_TYPING_END, { chatId, members, senderId: user._id });
  };

  return { messages, sendMessage, isTyping, startTyping, stopTyping, onlineUsers };
};
