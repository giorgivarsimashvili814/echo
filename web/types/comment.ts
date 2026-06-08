import { Author, VoteType } from "./post";

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  replyCount: number;
  upvotes: number;
  downvotes: number;
  userVote: VoteType;
  canEdit: boolean;
  canDelete: boolean;
}

export interface CommentsResponse {
  comments: Comment[];
  nextCursor: string | null;
}
