import { createSlice } from "@reduxjs/toolkit";
import { verifyOtp } from "../actions/user.action";
import { User } from "@/types/auth";

export interface UserState {
  currentUser: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  error: null,
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // clear storage
      localStorage.removeItem("refresh_token");
      sessionStorage.removeItem("access_token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(verifyOtp.fulfilled, (state, action) => {
      console.log("redux slice from see action",action.payload.user)
      state.isAuthenticated = true;
      state.currentUser = {
        _id: action.payload.user._id,
        email: action.payload.user.email,
        username: action.payload.user.username,
        profileImage: action.payload.user.profileImage,
      };
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = action.payload || "Something went wrong";
    });
  },
});

export const { logout } = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user.currentUser;
export const selectIsAuthenticated = (state: { user: UserState }) =>
  state.user.isAuthenticated;
export const selectTokens = (state: { user: UserState }) => ({
  accessToken: state.user.accessToken,
  refreshToken: state.user.refreshToken,
});
export const selectAuthError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer;
