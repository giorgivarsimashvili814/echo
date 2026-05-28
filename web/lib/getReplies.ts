export async function getReplies(commentId: string, cursor: string | null) {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}/replies`,
  );
  if (cursor) url.searchParams.append("cursor", cursor);

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch replies");
  return res.json();
}
