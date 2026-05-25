export async function createComment(
  content: string,
  postId: string,
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    },
  );

  if (!res.ok) throw new Error("Failed to create comment");

  const { comment } = await res.json();
  return comment;
}
