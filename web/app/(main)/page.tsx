import PostsFeed from "@/components/PostsFeed";
import { getPosts } from "@/lib/getPosts";

export default async function page() {
  const { posts, nextCursor } = await getPosts();

  return <PostsFeed initialPosts={posts} initialCursor={nextCursor} />;
}
