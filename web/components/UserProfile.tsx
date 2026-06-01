"use client";

import { User, UserInfo } from "@/types/user";
import { Dot } from "lucide-react";
import FollowButton from "./FollowButton";
import { useState } from "react";
import Link from "next/link";

export default function UserProfile({
  user,
  currentUser,
}: {
  user: UserInfo;
  currentUser: User | null;
}) {
  const [followerCount, setFollowerCount] = useState(user!.followerCount);

  const handleFollowChange = (viewerFollows: boolean) => {
    setFollowerCount((c) => (viewerFollows ? c + 1 : c - 1));
  };

  return (
    <div className="w-full flex gap-5 items-center justify-between max-md:flex-col">
      <div className="flex gap-5 items-center max-md:flex-col">
        <div className="bg-black rounded-full w-42 h-42 shrink-0"></div>
        <article className="flex flex-col max-md:items-center">
          <p className="text-2xl md:text-3xl font-medium">{user!.username}</p>
          <div className="flex">
            <Link href={`/users/${user.id}/followers`}>{followerCount} followers</Link>

            <Dot />
            <Link href={`/users/${user.id}/following`}>{user!.followingCount} following</Link>
          </div>
        </article>
      </div>
      {currentUser?.id !== user!.id && (
        <FollowButton user={user!} onFollowChange={handleFollowChange} />
      )}
    </div>
  );
}
