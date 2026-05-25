"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { getComments } from "@/lib/getComments";
import CommentCard from "./CommentCard";
import { Comment } from "@/types/comment";
import CreateComment from "./CreateComment";
import CommentSkeleton from "./CommentSkeleton";

export default function CommentSection({ postId }: { postId: string }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments", postId],
      queryFn: ({ pageParam }) => getComments(postId, pageParam),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: null as string | null,
      staleTime: 0,
    });

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];

  return (
    <div className="flex flex-col w-full">
      <div className="max-h-80 overflow-y-auto w-full built-in-scrollbar">
        {comments.map((comment: Comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}

        {hasNextPage && (
          <>
            <CommentSkeleton />
            <CommentSkeleton ref={ref} />
          </>
        )}
      </div>

      <CreateComment postId={postId} />
    </div>
  );
}
