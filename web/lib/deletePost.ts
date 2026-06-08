export async function deletePost(postId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to delete post");
}