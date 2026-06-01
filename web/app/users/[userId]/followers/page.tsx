import { getUserFollowers } from "@/lib/getUserFollowers";

export default async function page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { followers } = await getUserFollowers((await params).userId);
  return (
    <div>
      {followers.map((f) => (
        <div key={f.id}>{f.username}</div>
      ))}
    </div>
  );
}
