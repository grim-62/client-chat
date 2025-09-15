import { io, Socket } from "socket.io-client";
import { store } from "@/store/store";
import {
  addMessage,
  userOnline,
  userOffline,
  typingStart,
  typingStop,
  setConnected,
} from "@/store/slice/chatSlice";

let socket: Socket | null = null;

export const initSocket = (userId: string) => {
  if (socket) return socket;

  socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001", {
    query: { userId },
    transports: ["websocket"],
  });

  // Connection events
  socket.on("connect", () => store.dispatch(setConnected(true)));
  socket.on("disconnect", () => store.dispatch(setConnected(false)));

  // Chat events
  socket.on("receiveMessage", (msg) => store.dispatch(addMessage(msg)));
  socket.on("userOnline", ({ userId }) =>
    store.dispatch(userOnline(userId))
  );
  socket.on("userOffline", ({ userId }) =>
    store.dispatch(userOffline(userId))
  );
  socket.on("typingStart", ({ senderId }) =>
    store.dispatch(typingStart(senderId))
  );
  socket.on("typingStop", ({ senderId }) =>
    store.dispatch(typingStop(senderId))
  );

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
