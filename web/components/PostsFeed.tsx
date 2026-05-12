"use client";

import { useRef, useState } from "react";
import PostCard from "@/components/PostCard";
import { useInView } from "react-intersection-observer";
import { Post } from "@/types/post";
import { getPostsClient } from "@/lib/getPostsClient";

export default function PostsFeed({
  initialPosts,
  initialCursor,
}: {
  initialPosts: Post[];
  initialCursor?: string;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [cursor, setCursor] = useState(initialCursor);
  const isFetchingRef = useRef(false);

  const { ref } = useInView({
    onChange: async (inView) => {
      if (!inView || !cursor || isFetchingRef.current) return;
      isFetchingRef.current = true;
      const { posts: newPosts, nextCursor } = await getPostsClient(cursor);
      setPosts((prev) => {
        const ids = new Set(prev.map((p) => p.id));
        return [...prev, ...newPosts.filter((p) => !ids.has(p.id))];
      });
      setCursor(nextCursor);
      isFetchingRef.current = false;
    },
  });

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {cursor && <div ref={ref}>aha ref</div>}
    </>
  );
}
