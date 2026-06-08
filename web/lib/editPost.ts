export async function editPost(postId: string, content: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error("Failed to edit post");

  const { post } = await res.json();
  return post;
}