"use client";

import { useState } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { toast } from "sonner";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { voteComment } from "@/lib/voteComment";
import { CommentsResponse } from "@/types/comment";
import { Button } from "./ui/button";

interface CommentVoteButtonProps {
  commentId: string;
  initialUpvotes: number;
  initialDownvotes: number;
  initialUserVote: "UPVOTE" | "DOWNVOTE" | null;
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

export default function CommentVoteButton({
  commentId,
  initialUpvotes,
  initialDownvotes,
  initialUserVote,
}: CommentVoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState(initialUserVote);
  const queryClient = useQueryClient();

  const handleVote = async (type: "UPVOTE" | "DOWNVOTE") => {
    const prev = { upvotes, downvotes, userVote };

    if (userVote === type) {
      setUserVote(null);
      type === "UPVOTE" ? setUpvotes((u) => u - 1) : setDownvotes((d) => d - 1);
    } else {
      if (userVote !== null) {
        userVote === "UPVOTE"
          ? setUpvotes((u) => u - 1)
          : setDownvotes((d) => d - 1);
      }
      type === "UPVOTE" ? setUpvotes((u) => u + 1) : setDownvotes((d) => d + 1);
      setUserVote(type);
    }

    try {
      const updatedComment = await voteComment(commentId, type);

      setUpvotes(updatedComment.upvotes);
      setDownvotes(updatedComment.downvotes);
      setUserVote(updatedComment.userVote);

      queryClient.setQueriesData<InfiniteData<CommentsResponse>>(
        { queryKey: ["comments"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              comments:
                page.comments.map((c) =>
                  c.id === commentId ? { ...c, ...updatedComment } : c,
                ) ?? [],
            })),
          };
        },
      );
    } catch {
      setUpvotes(prev.upvotes);
      setDownvotes(prev.downvotes);
      setUserVote(prev.userVote);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex">
      <Button
        variant="ghost"
        onClick={() => handleVote("UPVOTE")}
        className="flex gap-1 px-1 py-0.5 rounded-full hover:bg-gray-100 cursor-pointer items-center"
      >
        <ArrowBigUp
          size={14}
          className={`transition-all ${userVote === "UPVOTE" && "fill-orange-500 text-orange-500"}`}
        />
        <span className="text-sm font-medium">
          {numberFormatter.format(upvotes)}
        </span>
      </Button>
      <Button
        variant="ghost"
        onClick={() => handleVote("DOWNVOTE")}
        className="flex gap-1 px-1 py-0.5 rounded-full hover:bg-gray-100 cursor-pointer items-center"
      >
        <ArrowBigDown
          size={14}
          className={`transition-all ${userVote === "DOWNVOTE" && "fill-blue-500 text-blue-500"}`}
        />
        <span className="text-sm font-medium">
          {numberFormatter.format(downvotes)}
        </span>
      </Button>
    </div>
  );
}
