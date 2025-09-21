import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Friend, Message } from "@/types/friend";
import { ChatService } from "@/services/chat.service";

interface ChatState {
  friends: Friend[];
  messages: Message[];
  typingUsers: string[];
  activeChatId: string | null;
  loading: boolean;
}

const initialState: ChatState = {
  friends: [],
  messages: [],
  typingUsers: [],
  activeChatId: null,
  loading: false,
};

// ✅ Async actions
export const fetchFriends = createAsyncThunk(
  "chat/fetchFriends",
  async () => {
    const response = await ChatService.getChats();
    return response
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (chatId: string) => {
    return await ChatService.getMessages(chatId);
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (s, a: PayloadAction<any>) => {
      s.activeChatId = a.payload;
    },
    addMessage: (s, a: PayloadAction<Message>) => {
      s.messages.push(a.payload);
    },
    setTyping: (s, a: PayloadAction<string>) => {
      if (!s.typingUsers.includes(a.payload)) s.typingUsers.push(a.payload);
    },
    clearTyping: (s, a: PayloadAction<string>) => {
      s.typingUsers = s.typingUsers.filter((id) => id !== a.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchFriends.fulfilled, (s, a) => {
        s.loading = false;
        s.friends = a.payload;
      })
      .addCase(fetchMessages.fulfilled, (s, a) => {
        s.messages = a.payload;
      });
  },
});


export const selectChatfriend = (state : any) =>state.chat.activeChatId;
export const { setActiveChat, addMessage, setTyping, clearTyping } =
  chatSlice.actions;
export default chatSlice.reducer;
