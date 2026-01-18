
export interface User {
  id: string;
  username: string;
  avatar?: string | undefined;
  followersCount:number;
  followingCount:number;
  posts: Post[];
  conversation: Conversation

}
export interface Conversation{
  id:string;
  lastvibeAt : Date |string

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
  id : string ;
  content: string;
  parentId:string;
  createdAt:Date | string ;
  updatedAt:Date | string;
  
}