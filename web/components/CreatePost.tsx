"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createPost } from "@/lib/createPost";
import { Textarea } from "@/components/ui/textarea";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { PostsResponse } from "@/types/post";

type CreatePostForm = {
  content: string;
};

export default function CreatePost() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreatePostForm>();

  const queryClient = useQueryClient();

  const onSubmit = async (data: CreatePostForm) => {
    try {
      const newPost = await createPost(data.content);
      reset();
      queryClient.setQueriesData<InfiniteData<PostsResponse>>(
        { queryKey: ["posts"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0 ? { ...page, posts: [newPost, ...page.posts] } : page,
            ),
          };
        },
      );
    } catch {
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
