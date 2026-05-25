export async function voteComment(
  commentId: string,
  type: "UPVOTE" | "DOWNVOTE",
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}/vote`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    },
  );

  if (!res.ok) throw new Error("Failed to vote");

  const { comment } = await res.json();
  return comment;
}
