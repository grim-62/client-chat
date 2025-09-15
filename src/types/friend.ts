export interface RequestResponceDataDto {
    requestId:string;
    accept: boolean
}

// src/types/chat.ts
export interface Friend {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  online: boolean;
}

export interface ChatMessage {
  senderId: string;
  recipientId: string;
  message: string;
  createdAt?: string;
}
