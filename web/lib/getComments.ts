// import { PostsResponse } from "@/types/post";

export async function getComments(postId: string, cursor: string | null) {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments`,
  );
  if (cursor) url.searchParams.append("cursor", cursor);

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}
