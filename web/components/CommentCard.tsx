import { Comment } from "@/types/comment";
import { FormatDistanceToken, formatDistanceToNow, Locale } from "date-fns";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import VoteButton from "./VoteButton";
import ReplySection from "./ReplySection";
import CreateComment from "./CreateComment";
import CommentActions from "./CommentActions";
import { useForm } from "react-hook-form";
import { useQueryClient, InfiniteData } from "@tanstack/react-query";
import { editComment } from "@/lib/editComment";
import { deleteComment } from "@/lib/deleteComment";
import { toast } from "sonner";
import { numberFormatter } from "./PostCard";
import { CommentsResponse } from "@/types/comment";
import { PostsResponse } from "@/types/post";


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
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { content: comment.content },
  });

  async function onSubmit({ content: newContent }: { content: string }) {
    setContent(newContent);
    setIsEditing(false);
    try {
      await editComment(comment.id, newContent);
      queryClient.setQueriesData<InfiniteData<CommentsResponse>>(
        { queryKey: ["comments", postId] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              comments: page.comments.map((c) =>
                c.id === comment.id ? { ...c, content: newContent } : c,
              ),
            })),
          };
        },
      );
    } catch {
      setContent(comment.content);
    }
  }

  async function handleDelete() {
    queryClient.setQueriesData<InfiniteData<CommentsResponse>>(
      { queryKey: ["comments", postId] },
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            comments: page.comments.filter((c) => c.id !== comment.id),
          })),
        };
      },
    );

    queryClient.setQueriesData<InfiniteData<PostsResponse>>(
      { queryKey: ["posts"] },
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.map((p) =>
              p.id === postId ? { ...p, commentCount: p.commentCount - 1 } : p,
            ),
          })),
        };
      },
    );
    
    try {
      await deleteComment(comment.id);

    } catch {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.error("Failed to delete comment");
    }
  }

  return (
    <div className="flex gap-1 w-full">
      <Link
        href={`/users/${comment.author.id}`}
        className="bg-black h-8 w-8 rounded-full shrink-0"
      ></Link>
      <div className="w-full">
        <div className="bg-gray-100 px-2 py-1 rounded-xl w-fit">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={`/users/${comment.author.id}`}
              className="font-medium text-sm"
            >
              {comment.author.username}
            </Link>
            <CommentActions
              canDelete={comment.canDelete}
              canEdit={comment.canEdit}
              isEditing={isEditing}
              onEdit={() => {
                reset({ content });
                setIsEditing(true);
              }}
              onDelete={handleDelete}
            />
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 mt-1">
              <textarea
                className="text-sm w-full border rounded p-2 resize-none focus:outline-none bg-white"
                rows={3}
                autoFocus
                {...register("content")}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => {
                    reset();
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button size="sm" type="submit">
                  Save
                </Button>
              </div>
            </form>
          ) : (
            <p>{content}</p>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-xs text-gray-500" suppressHydrationWarning>
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
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
            <ReplySection
              postId={postId}
              parentId={comment.id}
              replyCount={comment.replyCount}
            />
          </div>
        )}

        {showReplyInput && isReply && parentId && (
          <CreateComment postId={postId} parentId={parentId} />
        )}
      </div>
    </div>
  );
}