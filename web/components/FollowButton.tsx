"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserInfo } from "@/types/user";
import { toast } from "sonner";
import { followUser } from "@/lib/followUser";

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
    const prev = viewerFollows;

    setViewerFollows(newViewerFollows);
    onFollowChange(newViewerFollows);

    try {
      await followUser(user.id);
    } catch {
      setViewerFollows(prev);
      onFollowChange(prev);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
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
