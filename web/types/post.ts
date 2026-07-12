export interface Author {
  id: string;
  username: string;
  avatar: { url: string } | null;
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  commentCount: number;
  upvotes: number;
  downvotes: number;
  userVote: VoteType;
  images: { id: string; url: string }[];
  canEdit:boolean;
  canDelete:boolean
}

export type VoteType = "UPVOTE" | "DOWNVOTE" | null;

export interface PostsResponse {
  posts: Post[];
  nextCursor: string | null;
}
