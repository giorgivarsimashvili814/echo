"use client";

import { useState } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { toast } from "sonner";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { votePost } from "@/lib/votePost";
import { voteComment } from "@/lib/voteComment";
import { PostsResponse } from "@/types/post";
import { CommentsResponse } from "@/types/comment";

type VoteState = {
  upvotes: number;
  downvotes: number;
  userVote: "UPVOTE" | "DOWNVOTE" | null;
};

type VoteTarget =
  | { type: "post"; id: string }
  | { type: "comment"; id: string; postId: string };

interface VoteButtonProps extends VoteState {
  target: VoteTarget;
  size?: "sm" | "md";
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

function computeNextState(
  current: VoteState,
  type: "UPVOTE" | "DOWNVOTE",
): VoteState {
  let { upvotes, downvotes, userVote } = current;

  if (userVote === type) {
    userVote = null;
    type === "UPVOTE" ? upvotes-- : downvotes--;
  } else {
    if (userVote !== null) {
      userVote === "UPVOTE" ? upvotes-- : downvotes--;
    }
    type === "UPVOTE" ? upvotes++ : downvotes++;
    userVote = type;
  }

  return { upvotes, downvotes, userVote };
}

export default function VoteButton({
  upvotes,
  downvotes,
  userVote,
  target,
  size = "md",
}: VoteButtonProps) {
  const [optimistic, setOptimistic] = useState<VoteState | null>(null);
  const queryClient = useQueryClient();

  const displayed = optimistic ?? { upvotes, downvotes, userVote };
  const iconSize = size === "sm" ? 14 : 18;
  const buttonClassName =
    size === "sm"
      ? "flex gap-1 px-1 py-0.5 rounded-full hover:bg-gray-100 cursor-pointer items-center"
      : "flex gap-2 px-2 py-1 rounded-full hover:bg-gray-100 cursor-pointer items-center";

  const handleVote = async (type: "UPVOTE" | "DOWNVOTE") => {
    const next = computeNextState(displayed, type);
    setOptimistic(next);

    try {
      if (target.type === "post") {
        const updated = await votePost(target.id, type);
        setOptimistic(null);

        queryClient.setQueriesData<InfiniteData<PostsResponse>>(
          { queryKey: ["posts"] },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                posts: page.posts.map((p) =>
                  p.id === target.id ? { ...p, ...updated } : p,
                ),
              })),
            };
          },
        );
      } else {
        const updated = await voteComment(target.id, type);
        setOptimistic(null);

        queryClient.setQueriesData<InfiniteData<CommentsResponse>>(
          { queryKey: ["comments", target.postId] },
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                comments: page.comments.map((c) =>
                  c.id === target.id ? { ...c, ...updated } : c,
                ),
              })),
            };
          },
        );
      }
    } catch {
      setOptimistic(null);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex">
      <Button
        variant="ghost"
        onClick={() => handleVote("UPVOTE")}
        className={buttonClassName}
      >
        <ArrowBigUp
          size={iconSize}
          className={`transition-all ${displayed.userVote === "UPVOTE" && "fill-orange-500 text-orange-500"}`}
        />
        <span className="text-sm font-medium">
          {numberFormatter.format(displayed.upvotes)}
        </span>
      </Button>
      <Button
        variant="ghost"
        onClick={() => handleVote("DOWNVOTE")}
        className={buttonClassName}
      >
        <ArrowBigDown
          size={iconSize}
          className={`transition-all ${displayed.userVote === "DOWNVOTE" && "fill-blue-500 text-blue-500"}`}
        />
        <span className="text-sm font-medium">
          {numberFormatter.format(displayed.downvotes)}
        </span>
      </Button>
    </div>
  );
}
