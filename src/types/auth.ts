export interface User {
  _id?:string;
  email?: string;
  username?: string;
  profileImage?: string;
}

export interface RequestOtpDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  code: string;
}

export interface SignOutDto {
  token:string
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}
export interface VerifyOtpResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

