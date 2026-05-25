import { formatDistanceToNow, FormatDistanceToken, Locale } from "date-fns";
import Link from "next/link";
import { Comment } from "@/types/comment";
import CommentVoteButton from "./CommentVoteButton";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import { numberFormatter } from "./PostCard";

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

export default function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-1 w-full">
      <Link
        href={`/users/${comment.author.id}`}
        className="bg-black h-8 w-8 rounded-full shrink-0"
      ></Link>
      <div>
        <div className="bg-gray-100 px-2 py-1 rounded-lg">
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
          <CommentVoteButton
            initialDownvotes={comment.downvotes}
            initialUpvotes={comment.upvotes}
            initialUserVote={comment.userVote}
            commentId={comment.id}
          />
          <Button
            variant="ghost"
            className="flex gap-1 px-1 py-0.5 rounded-full"
          >
            <MessageCircle size={14} />
            <span className="text-sm font-medium">
              {numberFormatter.format(comment.replyCount)}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
