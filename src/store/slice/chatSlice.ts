import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Friend, ChatMessage } from "@/types/friend";

interface ChatState {
  friends: Friend[];
  messages: ChatMessage[];
  typingUsers: string[];
  connected: boolean;
}

const initialState: ChatState = {
  friends: [],
  messages: [],
  typingUsers: [],
  connected: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      state.friends = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    userOnline: (state, action: PayloadAction<string>) => {
      state.friends = state.friends.map((f) =>
        f._id === action.payload ? { ...f, online: true } : f
      );
    },
    userOffline: (state, action: PayloadAction<string>) => {
      state.friends = state.friends.map((f) =>
        f._id === action.payload ? { ...f, online: false } : f
      );
    },
    typingStart: (state, action: PayloadAction<string>) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    typingStop: (state, action: PayloadAction<string>) => {
      state.typingUsers = state.typingUsers.filter(
        (id) => id !== action.payload
      );
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    resetChat: () => initialState,
  },
});

export const {
  setFriends,
  addMessage,
  userOnline,
  userOffline,
  typingStart,
  typingStop,
  setConnected,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
