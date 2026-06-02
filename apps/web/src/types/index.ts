export interface User {
  id: string;
  username: string;
  avatar?: string | undefined;
  followersCount: number;
  followingCount: number;
  posts: Post[];
  conversation: Conversation[]
}
 
export interface Post {
  id: string;
  content: string;
  media: string[];
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  authorId: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
  };
  deleted: boolean;
  deletedAt: Date | string | null;
}

export interface Comment {
  id: string;
  content: string;
  parentId: string | null;
  postId: string
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Conversation {
  id: string;
  lastVibeAt: Date | string
  participants: User[] | UserBasic[]
  messages?: Message[]
  createdAt?: Date | string
}

export interface Message {
  id: string;
  text: string;
  media: string[];
  senderId: string;
  sender: UserBasic;
  conversationId: string
  isRead: boolean;
  createdAt: Date | string;
 
}

export interface UserBasic {
  id: string;
  username: string
  avatar?: string | null
}

// message payloads client -> server 
export interface sendMessagePayload {
  type: 'send_message';
  conversationId: string;
  message: string;
  media?: string[];
}

export interface TypingPayload {
  type: 'typing';
  conversationId: string;
}

export interface ReadMessagePayload {
  type: 'read_message'
  conversationId: string
  messageId: string
}

export interface PingPayload {
  type: 'ping'
}

export type WebSocketClientMessage = | sendMessagePayload | TypingPayload | ReadMessagePayload | PingPayload

// websocket events server ->client

export type WebSocketEventType =
  | 'connection_established'
  | 'new_message'
  | 'user_typing'
  | 'message_read'
  | 'error'
  | 'pong';

export interface ConnectionEstablishedEvent {
  type: 'connection_established';
  userId: string;
  timestamp: Date | string;
}

export interface NewMessageEvent {
  type: 'new_message';
  message: Message;
}

export interface UserTypingEvent {
  type: 'user_typing';
  conversationId: string;
  userId: string;
}

export interface MessageReadEvent {
  type: 'message_read';
  messageId: string;
  conversationId: string;
  readBy: string;
}

export interface ErrorEvent {
  type: 'error';
  message: string;
}

export interface PongEvent {
  type: 'pong';
}

export type WebSocketServerEvent =
  | ConnectionEstablishedEvent
  | NewMessageEvent
  | UserTypingEvent
  | MessageReadEvent
  | ErrorEvent
  | PongEvent;

export interface GetMessagesResponse {
  messages: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetConversationsResponse {
  conversations: (Conversation & {
    messages: Message[]; // Last message
  })[];
}

export interface CreateConversationResponse {
  conversation: Conversation;
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file'
}

export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export enum NotificationType {
  NEW_MESSAGE = 'new_message',
  NEW_FOLLOWER = 'new_follower',
  POST_LIKE = 'post_like',
  POST_COMMENT = 'post_comment'
}
