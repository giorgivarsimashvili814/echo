export async function votePost(postId: string, type: "UPVOTE" | "DOWNVOTE") {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/vote`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    },
  );

  if (!res.ok) throw new Error("Failed to vote");

  const { post } = await res.json();
  return post;
}
