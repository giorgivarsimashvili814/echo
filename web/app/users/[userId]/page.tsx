import { getUserInfo } from "@/lib/getUserInfo";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function page({ params }: Props) {
  const { userId } = await params;
  const user = await getUserInfo(userId);
  if (!user) return <div>Something went wrong</div>;
  return (
    <>
      <p>username: {user.username}</p>
      <p>followers: {user.followerCount}</p>
      <p>follwing: {user.followingCount}</p>
      <p>follows me: {user.followsViewer.toString()}</p>
      <p>is followed by me: {user.viewerFollows.toString()}</p>
    </>
  );
}
