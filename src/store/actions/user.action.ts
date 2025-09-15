import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AuthService } from "@/services/auth.service";
import { VerifyOtpDto, VerifyOtpResponse } from "@/types/auth";
import { toast } from "sonner";

// Helper to save tokens
const saveAuthData = (accessToken: string, refreshToken: string) => {
  sessionStorage.setItem("access_token", accessToken); // short-lived
  localStorage.setItem("refresh_token", refreshToken); // persistent
};

export const verifyOtp = createAsyncThunk<
  VerifyOtpResponse,      // return type
  VerifyOtpDto,           // payload type
  { rejectValue: string } // error type
>(
  "auth/verifyOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await AuthService.verifyOtp(payload);

      if (!response.accessToken || !response.refreshToken) {
        return rejectWithValue("Missing access or refresh token in response.");
      }

      // Save tokens
      saveAuthData(response.accessToken, response.refreshToken);
      toast.success(`Hello ${response.user.username}`)
      return response as VerifyOtpResponse;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message =
        error.response?.data?.message || "OTP verification failed.";
      return rejectWithValue(message);
    }
  }
);
