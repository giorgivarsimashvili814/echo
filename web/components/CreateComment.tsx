"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { InfiniteData, useQuery, useQueryClient } from "@tanstack/react-query";
import { Comment, CommentsResponse } from "@/types/comment";
import { createComment } from "@/lib/createComment";
import { PostsResponse } from "@/types/post";
import { getCurrentUserClient } from "@/lib/getCurrentUserClient";

type CreateCommentForm = {
  content: string;
  parentId?: string;
};

export default function CreateComment({
  postId,
  parentId,
}: {
  postId: string;
  parentId?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateCommentForm>();

  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: getCurrentUserClient,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  const onSubmit = async (data: CreateCommentForm) => {
    if (!currentUser) return;
    const tempId = crypto.randomUUID();

    const optimisticComment: Comment = {
      id: tempId,
      content: data.content,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      replyCount: 0,
      author: { id: currentUser.id, username: currentUser.username , avatar: currentUser.avatar},
      canEdit: true,
      canDelete: true,
    };

    queryClient.setQueriesData<InfiniteData<CommentsResponse>>(
      { queryKey: ["comments", postId, parentId || null] },
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page, index) =>
            index === 0
              ? { ...page, comments: [optimisticComment, ...page.comments] }
              : page,
          ),
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
              p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p,
            ),
          })),
        };
      },
    );

    queryClient.setQueriesData<InfiniteData<CommentsResponse>>(
      { queryKey: ["comments", postId] },
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            comments: page.comments.map((c) =>
              c.id === parentId ? { ...c, replyCount: c.replyCount + 1 } : c,
            ),
          })),
        };
      },
    );

    reset();

    try {
      const newComment = await createComment(data.content, postId, parentId);

      queryClient.setQueriesData<InfiniteData<CommentsResponse>>(
        { queryKey: ["comments", postId, parentId || null] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    comments: page.comments.map((c) =>
                      c.id === tempId
                        ? { ...newComment, canEdit: true, canDelete: true }
                        : c,
                    ),
                  }
                : page,
            ),
          };
        },
      );
    } catch {
      queryClient.setQueriesData<InfiniteData<CommentsResponse>>(
        { queryKey: ["comments", postId, parentId || null] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              comments: page.comments.filter((c) => c.id !== tempId),
            })),
          };
        },
      );
      toast.error("Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 bg-white pt-3 p-2"
    >
      <Textarea
        className="bg-white"
        placeholder="Share your thoughts..."
        {...register("content", {
          required: "Content is required",
          minLength: { value: 1, message: "Content is required" },
          maxLength: { value: 500, message: "Max 500 characters" },
        })}
      />
      {errors.content && (
        <p className="text-sm text-red-500">{errors.content.message}</p>
      )}
      <Button type="submit" disabled={isSubmitting} className="self-end">
        {isSubmitting ? "Commenting..." : "Comment"}
      </Button>
    </form>
  );
}
