
export interface User {
  id: string;
  username: string;
  avatar?: string | null;
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: User;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
}