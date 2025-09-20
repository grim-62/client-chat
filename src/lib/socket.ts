import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "@/services/api";

export interface Friend {
  _id: string;
  username: string;
  profileImage?: string;
  online: boolean;
}

interface ChatState {
  friends: Friend[];
}

const initialState: ChatState = {
  friends: [],
};

// Fetch friends once at load
export const fetchFriends = createAsyncThunk(
  "chat/fetchFriends",
  async (userId: string) => {
    const { data } = await api.get(`/chat/${userId}`);
    return data as Friend[];
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    updateFriendStatus(
      state,
      action: PayloadAction<{ userId: string; online: boolean }>
    ) {
      const friend = state.friends.find((f) => f._id === action.payload.userId);
      if (friend) {
        friend.online = action.payload.online;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFriends.fulfilled, (state, action) => {
      state.friends = action.payload;
    });
  },
});

export const { updateFriendStatus } = chatSlice.actions;
export default chatSlice.reducer;
