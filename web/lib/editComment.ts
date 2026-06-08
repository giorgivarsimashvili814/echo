export async function editComment(commentId: string, content: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error("Failed to edit comment");

  const { comment } = await res.json();
  return comment;
}