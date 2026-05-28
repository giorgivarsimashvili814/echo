import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import CommentCard from "./CommentCard";
import CommentSkeleton from "./CommentSkeleton";
import CreateComment from "./CreateComment";
import { getReplies } from "@/lib/getReplies";

export default function ReplySection({
  postId,
  parentId,
}: {
  postId: string;
  parentId: string;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments", postId, parentId],
      queryFn: ({ pageParam }) => getReplies(parentId, pageParam),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: null as string | null,
      staleTime: 1000 * 60,
    });

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
  });

  const replies = data?.pages.flatMap((page) => page.comments) ?? [];

  return (
    <div className="flex flex-col">
      {replies.map((reply) => (
        <CommentCard
          key={reply.id}
          comment={reply}
          postId={postId}
          isReply
          parentId={parentId}
        />
      ))}
      {hasNextPage && <CommentSkeleton ref={ref} />}
      <CreateComment postId={postId} parentId={parentId} />
    </div>
  );
}
