// // src/hooks/useChatSocket.ts
// "use client";
// import { useEffect, useState } from "react";
// import { getSocket, disconnectSocket } from "@/lib/socket";
// import { Friend, ChatMessage } from "@/types/friend";

// export const useChatSocket = (userId: string) => {
//   const [friends, setFriends] = useState<Friend[]>([]);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [typingUsers, setTypingUsers] = useState<string[]>([]);

//   useEffect(() => {
//     if (!userId) return;

//     const socket = getSocket(userId);

//     // 👥 Friend online/offline status
//     socket.on("userOnline", ({ userId }) => {
//       setFriends((prev) =>
//         prev.map((f) => (f._id === userId ? { ...f, online: true } : f))
//       );
//     });

//     socket.on("userOffline", ({ userId }) => {
//       setFriends((prev) =>
//         prev.map((f) => (f._id === userId ? { ...f, online: false } : f))
//       );
//     });

//     // 💬 Incoming messages
//     socket.on("receiveMessage", (msg: ChatMessage) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     // ✍️ Typing events
//     socket.on("typingStart", ({ senderId }) => {
//       setTypingUsers((prev) => [...new Set([...prev, senderId])]);
//     });

//     socket.on("typingStop", ({ senderId }) => {
//       setTypingUsers((prev) => prev.filter((id) => id !== senderId));
//     });

//     return () => {
//       socket.off("userOnline");
//       socket.off("userOffline");
//       socket.off("receiveMessage");
//       socket.off("typingStart");
//       socket.off("typingStop");
//       disconnectSocket();
//     };
//   }, [userId]);

//   const sendMessage = (recipientId: string, message: string) => {
//     const socket = getSocket(userId);
//     const msg: ChatMessage = { senderId: userId, recipientId, message };
//     socket.emit("sendMessage", msg);
//     setMessages((prev) => [...prev, msg]); // optimistic update
//   };

//   const startTyping = (recipientId: string) => {
//     getSocket(userId).emit("typingStart", { senderId: userId, recipientId });
//   };

//   const stopTyping = (recipientId: string) => {
//     getSocket(userId).emit("typingStop", { senderId: userId, recipientId });
//   };

//   return {
//     friends,
//     setFriends, // so you can load initial list from API
//     messages,
//     typingUsers,
//     sendMessage,
//     startTyping,
//     stopTyping,
//   };
// };
