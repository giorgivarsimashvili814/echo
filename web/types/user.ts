export interface User {
  id: string;
  email: string;
  username: string;
}

export interface UserRelationship {
  id: string;
  username: string;
  viewerFollows: boolean;
  followsViewer: boolean;
}

export interface UserInfo {
  id: string;
  username: string;
  followerCount: number;
  followingCount: number;
  viewerFollows: boolean;
  followsViewer: boolean;
}

export interface FollowersResponse {
  followers: UserRelationship[];
  nextCursor: string | null;
}

export interface FollowingResponse {
  following: UserRelationship[];
  nextCursor: string | null;
}
