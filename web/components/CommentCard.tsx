import { formatDistanceToNow, FormatDistanceToken, Locale } from "date-fns";
import Link from "next/link";
import { Comment } from "@/types/comment";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import { numberFormatter } from "./PostCard";
import VoteButton from "./VoteButton";
import { useState } from "react";
import ReplySection from "./ReplySection";
import CreateComment from "./CreateComment";

const shortLocale: Pick<Locale, "formatDistance"> = {
  formatDistance: (token: FormatDistanceToken, count: number) => {
    const formatStrings: Partial<Record<FormatDistanceToken, string>> = {
      lessThanXSeconds: "now",
      xSeconds: "now",
      halfAMinute: "now",
      lessThanXMinutes: `${count}m`,
      xMinutes: `${count}m`,
      aboutXHours: `${count}h`,
      xHours: `${count}h`,
      xDays: `${count}d`,
      aboutXMonths: `${count}mo`,
      xMonths: `${count}mo`,
      aboutXYears: `${count}y`,
      xYears: `${count}y`,
      overXYears: `${count}y`,
      almostXYears: `${count}y`,
    };

    return formatStrings[token] || `${count}m`;
  },
};

export default function CommentCard({
  comment,
  postId,
  parentId,
  isReply = false,
}: {
  comment: Comment;
  postId: string;
  parentId?: string;
  isReply?: boolean;
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  return (
    <div className="flex gap-1 w-full">
      <Link
        href={`/users/${comment.author.id}`}
        className="bg-black h-8 w-8 rounded-full shrink-0"
      ></Link>
      <div className="w-full">
        <div className="bg-gray-100 px-2 py-1 rounded-lg w-fit">
          <Link
            href={`/users/${comment.author.id}`}
            className="font-medium text-sm"
          >
            {comment.author.username}
          </Link>
          <p>{comment.content}</p>
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-xs text-gray-500" suppressHydrationWarning>
            {formatDistanceToNow(new Date(comment.createdAt), {
              locale: shortLocale,
            })}
          </span>
          <VoteButton
            upvotes={comment.upvotes}
            downvotes={comment.downvotes}
            userVote={comment.userVote}
            target={{ type: "comment", id: comment.id, postId: postId }}
            size="sm"
          />
          <Button
            variant="ghost"
            className="flex gap-1 px-1 py-0.5 rounded-full"
            onClick={() => {
              if (isReply) {
                setShowReplyInput((prev) => !prev);
              } else {
                setShowReplies((prev) => !prev);
              }
            }}
          >
            {isReply ? <p>Reply</p> : <MessageCircle size={14} />}

            {!isReply && (
              <span className="text-sm font-medium">
                {numberFormatter.format(comment.replyCount)}
              </span>
            )}
          </Button>
        </div>
        {showReplies && !isReply && (
          <div className="ml-2">
            <ReplySection postId={postId} parentId={comment.id} />
          </div>
        )}
        {showReplyInput && isReply && parentId && (
          <CreateComment postId={postId} parentId={parentId} />
        )}
      </div>
    </div>
  );
}
