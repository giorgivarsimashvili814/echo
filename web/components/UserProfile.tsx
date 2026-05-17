"use client";

import { User, UserInfo } from "@/types/user";
import { Dot } from "lucide-react";
import FollowButton from "./FollowButton";
import { useState } from "react";

export default function UserProfile({
  user,
  currentUser,
}: {
  user: UserInfo | null;
  currentUser: User | null;
}) {
  const [followerCount, setFollowerCount] = useState(user!.followerCount);

  const handleFollowChange = (viewerFollows: boolean) => {
    setFollowerCount((c) => (viewerFollows ? c + 1 : c - 1));
  };

  return (
    <div className="w-full flex gap-5 items-center justify-between">
      <div className="flex gap-5 items-center">
        <div className="bg-black rounded-full w-16 h-16 md:w-40 md:h-40 shrink-0"></div>
        <article className="flex flex-col">
          <p className="text-2xl md:text-3xl font-medium">{user!.username}</p>
          <div className="flex flex-wrap">
            <span>{followerCount} followers</span>
            <Dot />
            <span>{user!.followingCount} following</span>
          </div>
        </article>
      </div>
      {currentUser?.id !== user!.id && (
        <FollowButton user={user!} onFollowChange={handleFollowChange} />
      )}
    </div>
  );
}
