import { Post } from "@/types/post";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import CommentSection from "./CommentSection";
import VoteButton from "./VoteButton";

export const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

export function PostCard({ post }: { post: Post }) {
  const [toggleComments, setToggleComments] = useState(false);

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
        <VoteButton
          upvotes={post.upvotes}
          downvotes={post.downvotes}
          userVote={post.userVote}
          target={{ type: "post", id: post.id }}
        />
        <Button
          variant="ghost"
          className="flex gap-2 px-2 py-1 rounded-full"
          onClick={() => {
            setToggleComments((prev) => !prev);
          }}
        >
          <MessageCircle size={18} />
          <span className="text-sm font-medium">
            {numberFormatter.format(post.commentCount)}
          </span>
        </Button>
      </div>
      {toggleComments && (
        <CommentSection postId={post.id} commentCount={post.commentCount} />
      )}
    </div>
  );
}
