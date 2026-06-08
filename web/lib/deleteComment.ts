export async function deleteComment(commentId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to delete comment");
}