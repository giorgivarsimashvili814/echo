"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { getComments } from "@/lib/getComments";
import CommentCard from "./CommentCard";
import CreateComment from "./CreateComment";
import CommentSkeleton from "./CommentSkeleton";

export default function CommentSection({
  postId,
  commentCount,
}: {
  postId: string;
  commentCount: number;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery({
      queryKey: ["comments", postId, null],
      queryFn: ({ pageParam }) => getComments(postId, pageParam),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: null as string | null,
      staleTime: 1000 * 60,
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
    <div className="flex flex-col w-full px-3">
      <div className="max-h-80 overflow-y-auto w-full built-in-scrollbar">
        {isPending && commentCount > 0 ? (
          <>
            <CommentSkeleton />
            <CommentSkeleton />
          </>
        ) : (
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} postId={postId} />
          ))
        )}

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
