export async function followUser(userId: string): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/follow`,
    {
      method: "POST",
      credentials: "include",
    },
  );

  if (!res.ok) throw new Error("Failed to follow user");
}