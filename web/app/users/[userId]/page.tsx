import PostsFeed from "@/components/PostsFeed";
import { getPosts } from "@/lib/getPosts";

export default async function page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const { posts, nextCursor } = await getPosts(undefined, userId);
  return (
    <PostsFeed
      initialPosts={posts}
      initialCursor={nextCursor}
      userId={userId}
    />
  );
}
