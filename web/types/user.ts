export interface User {
  id: string;
  email: string;
  username: string;
}

export interface UserInfo {
  id: string;
  username: string;
  followerCount: number;
  followingCount: number;
  viewerFollows: boolean;
  followsViewer: boolean;
}
