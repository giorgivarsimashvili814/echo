"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { PostCard } from "@/components/PostCard";
import { useInView } from "react-intersection-observer";
import { Post } from "@/types/post";
import { getPostsClient } from "@/lib/getPostsClient";
import PostSkeleton from "./PostSkeleton";

export default function PostsFeed({
  initialPosts,
  initialCursor,
  userId,
}: {
  initialPosts: Post[];
  initialCursor: string | null;
  userId?: string;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts", userId],
      queryFn: ({ pageParam }) => getPostsClient(pageParam, userId),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: null as string | null,
      staleTime: 0,
      initialData: {
        pages: [{ posts: initialPosts, nextCursor: initialCursor }],
        pageParams: [null],
      },
    });

  const posts = data.pages.flatMap((page) => page.posts);

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  return (
    <>
      {posts.map((post: Post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {hasNextPage && (
        <>
          <PostSkeleton />
          <PostSkeleton ref={ref} />
        </>
      )}

      {!hasNextPage && posts.length > 0 && (
        <p className="text-center text-sm text-gray-500">No more posts</p>
      )}
    </>
  );
}
