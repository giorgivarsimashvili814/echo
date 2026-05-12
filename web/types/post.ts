export interface Author {
  id: string;
  username: string;
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
}

export type VoteType = "UPVOTE" | "DOWNVOTE" | null;

export interface PostsResponse {
  posts: Post[];
  nextCursor?: string;
}
