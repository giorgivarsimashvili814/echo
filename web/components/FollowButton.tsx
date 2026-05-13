"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserInfo } from "@/types/user";

export default function FollowButton({
  user,
  onFollowChange,
}: {
  user: UserInfo;
  onFollowChange: (viewerFollows: boolean) => void;
}) {
  const [viewerFollows, setViewerFollows] = useState(user.viewerFollows);
  const [followsViewer, setFollowsViewer] = useState(user.followsViewer);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);
    const newViewerFollows = !viewerFollows;
    const prev = { viewerFollows, followsViewer };

    setViewerFollows(newViewerFollows);
    onFollowChange(newViewerFollows);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}/follow`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (!res.ok) {
      setViewerFollows(prev.viewerFollows);
      onFollowChange(prev.viewerFollows);
    }

    setIsLoading(false);
  };

  const getLabel = () => {
    if (viewerFollows && followsViewer) return "Friends";
    if (viewerFollows) return "Following";
    if (followsViewer) return "Follow Back";
    return "Follow";
  };

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      variant={viewerFollows ? "outline" : "default"}
    >
      {getLabel()}
    </Button>
  );
}
