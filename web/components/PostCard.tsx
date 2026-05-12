"use client";

import { useState } from "react";
import { Post } from "@/types/post";
import { formatDistanceToNow } from "date-fns";
import { ArrowBigDown, ArrowBigUp, MessageCircle } from "lucide-react";
import Link from "next/link";

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

export default function PostCard({ post }: { post: Post }) {
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [downvotes, setDownvotes] = useState(post.downvotes);
  const [userVote, setUserVote] = useState(post.userVote);

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

    const res = await fetch(`http://localhost:3001/posts/${post.id}/vote`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });

    if (!res.ok) {
      setUpvotes(prev.upvotes);
      setDownvotes(prev.downvotes);
      setUserVote(prev.userVote);
    }
  };

  return (
    <div className="rounded-lg p-2 flex flex-col gap-2 bg-white shadow w-full">
      <Link
        href={`/users/${post.author.id}`}
        className="flex gap-2 items-center"
      >
        <div className="bg-black h-10 w-10 rounded-full"></div>
        <article className="flex flex-col">
          <p className="text-md font-medium">{post.author.username}</p>
          <span className="text-xs text-gray-500" suppressHydrationWarning>
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </span>
        </article>
      </Link>
      <p className="text-sm line-clamp-5">{post.content}</p>
      <div className="flex gap-5">
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
        <div className="flex gap-2 px-2 py-1 rounded-full hover:bg-gray-100 cursor-pointer items-center">
          <MessageCircle size={18} />
          <span className="text-sm font-medium">
            {numberFormatter.format(post.commentCount)}
          </span>
        </div>
      </div>
    </div>
  );
}
