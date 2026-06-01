import PostsFeed from "@/components/PostsFeed";
import { getPosts } from "@/lib/getPosts";

export default async function page({ userId }: { userId: string }) {
  const { posts, nextCursor } = await getPosts(undefined, userId);

  return (
    <PostsFeed
      initialPosts={posts}
      initialCursor={nextCursor}
      userId={userId}
    />
  );
}
