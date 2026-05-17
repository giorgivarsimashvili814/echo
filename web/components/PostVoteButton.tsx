"use client";

import { useState } from "react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { votePost } from "@/lib/votePost";
import { toast } from "sonner";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { PostsResponse } from "@/types/post";

interface PostVoteButtonProps {
  postId: string;
  initialUpvotes: number;
  initialDownvotes: number;
  initialUserVote: "UPVOTE" | "DOWNVOTE" | null;
}

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

export default function PostVoteButton({
  postId,
  initialUpvotes,
  initialDownvotes,
  initialUserVote,
}: PostVoteButtonProps) {
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
      const updatedPost = await votePost(postId, type);
      setUpvotes(updatedPost.upvotes);
      setDownvotes(updatedPost.downvotes);
      setUserVote(updatedPost.userVote);
      queryClient.setQueriesData<InfiniteData<PostsResponse>>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.map((p) =>
                p.id === postId ? { ...p, ...updatedPost } : p,
              ),
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
      <div
        onClick={() => handleVote("UPVOTE")}
        className="flex gap-2 px-2 py-1 rounded-full hover:bg-gray-100 cursor-pointer items-center"
      >
        <ArrowBigUp
          size={18}
          className={`transition-all ${userVote === "UPVOTE" && "fill-orange-500 text-orange-500"}`}
        />
        <span className="text-sm font-medium">
          {numberFormatter.format(upvotes)}
        </span>
      </div>
      <div
        onClick={() => handleVote("DOWNVOTE")}
        className="flex gap-2 px-2 py-1 rounded-full hover:bg-gray-100 cursor-pointer items-center"
      >
        <ArrowBigDown
          size={18}
          className={`transition-all ${userVote === "DOWNVOTE" && "fill-blue-500 text-blue-500"}`}
        />
        <span className="text-sm font-medium">
          {numberFormatter.format(downvotes)}
        </span>
      </div>
    </div>
  );
}
