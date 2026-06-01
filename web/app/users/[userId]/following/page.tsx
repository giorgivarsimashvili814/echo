import { getUserFollowing } from "@/lib/getUserFollowing";

export default async function page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { following } = await getUserFollowing((await params).userId);
  return (
    <div>
      {following.map((f) => (
        <div key={f.id}>{f.username}</div>
      ))}
    </div>
  );
}
