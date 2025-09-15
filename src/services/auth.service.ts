import { api } from "./api";
import type { RequestOtpDto, VerifyOtpDto, AuthResponse, User, SignOutDto } from "@/types/auth";

export const AuthService = {
  requestOtp: async (dto: RequestOtpDto) => {
    try {
      const response = await api.post("/auth/request-otp", dto);
      return response.data;
    } catch (error: any) {
      console.error("Request OTP error:", error);
      throw new Error(error.response?.data?.message || "Failed to send OTP");
    }
  },
  
  verifyOtp: async (dto: VerifyOtpDto) => {
    try {
      const response = await api.post<AuthResponse>("/auth/verify-otp", dto);
      return response.data;
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      throw new Error(error.response?.data?.message || "Failed to verify OTP");
    }
  },
  
  getCurrentUser: async () => {
    try {
      const response = await api.get<User>("/user");
      console.log("Current user data:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Get current user error:", error);
      throw new Error(error.response?.data?.message || "Failed to get user data");
    }
  },
  
  logout: async (dto: SignOutDto) => {
    try {
      const response = await api.post("/auth/sign-out", dto);
      return response.data;
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(error.response?.data?.message || "Failed to logout");
    }
  },
  
  getMe: async () => {
    try {
      const response = await api.get<AuthResponse["user"]>("/users/me");
      return response.data;
    } catch (error: any) {
      console.error("Get me error:", error);
      throw new Error(error.response?.data?.message || "Failed to get user profile");
    }
  },
};

