export interface User {
  id: string;
  email: string;
  username: string;
  avatar:{url:string} | null
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
  avatar: {url:string} | null
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

export interface FindAllUsersResponse {
  users: User[];
  nextCursor: string | null;
}
