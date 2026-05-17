import CreatePost from "@/components/CreatePost";
import PostsFeed from "@/components/PostsFeed";
import { getPosts } from "@/lib/getPosts";

export default async function page() {
  const { posts, nextCursor } = await getPosts();

  return (
    <>
      <CreatePost />
      <PostsFeed initialPosts={posts} initialCursor={nextCursor} />
    </>
  );
}
