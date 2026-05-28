import CreatePost from "@/components/CreatePost";
import PostsFeed from "@/components/PostsFeed";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getPosts } from "@/lib/getPosts";

export default async function page() {
  const [{ posts, nextCursor }, currentUser] = await Promise.all([
    getPosts(),
    getCurrentUser(),
  ]);

  return (
    <>
      <CreatePost currentUser={currentUser!} />
      <PostsFeed initialPosts={posts} initialCursor={nextCursor} />
    </>
  );
}
