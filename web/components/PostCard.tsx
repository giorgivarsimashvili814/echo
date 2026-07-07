import { Post, PostsResponse } from "@/types/post";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import CommentSection from "./CommentSection";
import VoteButton from "./VoteButton";
import PostActions from "./PostActions";
import { useForm } from "react-hook-form";
import { editPost } from "@/lib/editPost";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/lib/deletePost";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import ImageGrid from "./ImageGrid";

export const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

export function PostCard({ post }: { post: Post }) {
  const [toggleComments, setToggleComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content);

  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { content: post.content },
  });

  async function onSubmit({ content: newContent }: { content: string }) {
    setContent(newContent);
    setIsEditing(false);
    try {
      await editPost(post.id, newContent);
      queryClient.setQueriesData<InfiniteData<PostsResponse>>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.map((p) =>
                p.id === post.id ? { ...p, content: newContent } : p,
              ),
            })),
          };
        },
      );
    } catch {
      setContent(post.content);
    }
  }

  async function handleDelete() {
    queryClient.setQueriesData<InfiniteData<PostsResponse>>(
      { queryKey: ["posts"] },
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            posts: page.posts.filter((p) => p.id !== post.id),
          })),
        };
      },
    );
    try {
      await deletePost(post.id);
    } catch {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.error("Failed to delete post");
    }
  }

  return (
    <div className="rounded-lg p-3 flex flex-col gap-2 bg-white shadow w-full">
      <div className="flex justify-between items-center">
        <Link
          href={`/users/${post.author.id}`}
          className="flex gap-2 items-center"
        >
          <div className="bg-black h-10 w-10 rounded-full"></div>
          <article className="flex flex-col">
            <p className="text-md font-medium">{post.author.username}</p>
            <span className="text-xs text-gray-500" suppressHydrationWarning>
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </article>
        </Link>
        <PostActions
          canDelete={post.canDelete}
          canEdit={post.canEdit}
          isEditing={isEditing}
          onEdit={() => {
            reset({ content });
            setIsEditing(true);
          }}
          onDelete={handleDelete}
        />
      </div>

      {isEditing ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 mt-1"
        >
          <Textarea
            className="resize-none bg-white"
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
        <p className="text-sm line-clamp-5">{content}</p>
      )}

      <ImageGrid images={post.images} />

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
          onClick={() => setToggleComments((prev) => !prev)}
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
