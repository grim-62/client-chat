import { User } from "./auth";

export interface CreateGroupChatDto {
  adminId?: string[];
  users: string[];
  chatName: string;
}
export interface CreateChatDto {
  receiverId: string;
}

export interface NotificationResponse {      // or _id: string, depending on your API
  _id?: string;   
  sender:{
    _id: string;
    username?: string;
    email: string;
    profileImage?: string;
  }       
};

export interface FriendlistResponse {
  _id: string;
  chatName: string;
  isGroup: boolean;
  email:string;
  profileImage?: string;
  username: string;
  member: any[];
  lastMessage: null | string;
}

