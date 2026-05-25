"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { CommentsResponse } from "@/types/comment";
import { createComment } from "@/lib/createComment";

type CreateCommentForm = {
  content: string;
  parentId?: string;
};

export default function CreateComment({ postId }: { postId: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateCommentForm>();

  const queryClient = useQueryClient();

  const onSubmit = async (data: CreateCommentForm) => {
    try {
      const newComment = await createComment(data.content, postId);
      reset();
      queryClient.setQueriesData<InfiniteData<CommentsResponse>>(
        { queryKey: ["comments"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page, index) =>
              index === 0
                ? { ...page, comments: [newComment, ...page.comments] }
                : page,
            ),
          };
        },
      );
    } catch {
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
