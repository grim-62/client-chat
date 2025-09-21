import { useEffect, useState } from "react";
import { initSocket, getSocket } from "@/lib/socket";

import {
  SOCKET_EVENT_MESSAGE,
  SOCKET_EVENT_TYPING,
  SOCKET_EVENT_STOP_TYPING,
  SOCKET_EVENT_ALERT,
} from "@/constants/constants"; // create same constants file for frontend

interface MessageInterface {
  senderId:string;
  recepent:string;
  message:string;
}

export const useChat = (userId: string, recipientId: string) => {
  const [messages, setMessages] = useState<{ senderId: string; message: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const socket = initSocket(userId);

    // message received
    socket.on(SOCKET_EVENT_MESSAGE, (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // new message alert
    socket.on(SOCKET_EVENT_ALERT, (data) => {
      console.log("New message alert", data);
      // setMessages((prev) => [...prev, data]);
    });

    // typing events
    socket.on(SOCKET_EVENT_TYPING, ({ senderId }) => {
      if (senderId === recipientId) setIsTyping(true);
    });

    socket.on(SOCKET_EVENT_STOP_TYPING, ({ senderId }) => {
      if (senderId === recipientId) setIsTyping(false);
    });

    return () => {
      socket.off(SOCKET_EVENT_MESSAGE);
      socket.off(SOCKET_EVENT_ALERT);
      socket.off(SOCKET_EVENT_TYPING);
      socket.off(SOCKET_EVENT_STOP_TYPING);
    };
  }, [userId, recipientId]);

  const sendMessage = (message: string) => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENT_MESSAGE, { senderId: userId, recipientId, message });
    console.log("message send to " , userId, recipientId, message)
  };

  const startTyping = () => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENT_TYPING, { senderId: userId, recipientId });
  };

  const stopTyping = () => {
    const socket = getSocket();
    socket.emit(SOCKET_EVENT_STOP_TYPING, { senderId: userId, recipientId });
  };


  return { messages, sendMessage, isTyping, startTyping, stopTyping };
};
