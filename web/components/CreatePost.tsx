"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createPost } from "@/lib/createPost";
import { Textarea } from "@/components/ui/textarea";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { Post, PostsResponse } from "@/types/post";
import { User } from "@/types/user";

type CreatePostForm = {
  content: string;
};

export default function CreatePost({ currentUser }: { currentUser: User }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreatePostForm>();

  const queryClient = useQueryClient();

  const onSubmit = async (data: CreatePostForm) => {
    const tempId = crypto.randomUUID();

    const optimisticPost: Post = {
      id: tempId,
      content: data.content,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      commentCount: 0,
      author: {
        id: currentUser.id,
        username: currentUser.username,
      },
    };

    queryClient.setQueriesData<InfiniteData<PostsResponse>>(
      { queryKey: ["posts"] },
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page, index) =>
            index === 0
              ? { ...page, posts: [optimisticPost, ...page.posts] }
              : page,
          ),
        };
      },
    );

    reset();

    try {
      const newPost = await createPost(data.content);

      queryClient.setQueriesData<InfiniteData<PostsResponse>>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? {
                    ...page,
                    posts: page.posts.map((p) =>
                      p.id === tempId ? newPost : p,
                    ),
                  }
                : page,
            ),
          };
        },
      );
    } catch {
      queryClient.setQueriesData<InfiniteData<PostsResponse>>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.filter((p) => p.id !== tempId),
            })),
          };
        },
      );
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      <Textarea
        className="bg-white"
        placeholder="What's on your mind?"
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
        {isSubmitting ? "Posting..." : "Post"}
      </Button>
    </form>
  );
}
