
export interface User {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
  commentCount?: number;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
}

export interface UsersResponse {
  users: Record<string, string>;
}

export interface PostsResponse {
  posts: Post[];
}

export interface CommentsResponse {
  comments: Comment[];
}
