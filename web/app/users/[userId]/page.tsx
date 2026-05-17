import PostsFeed from "@/components/PostsFeed";
import UserProfile from "@/components/UserProfile";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getPosts } from "@/lib/getPosts";
import { getUserInfo } from "@/lib/getUserInfo";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function page({ params }: Props) {
  const { userId } = await params;
  const user = await getUserInfo(userId);
  const currentUser = await getCurrentUser();

  if (!user) notFound();

  const { posts, nextCursor } = await getPosts(undefined, userId);

  return (
    <>
      <UserProfile user={user} currentUser={currentUser} />
      <PostsFeed initialPosts={posts} initialCursor={nextCursor} userId={userId}/>
    </>
  );
}
