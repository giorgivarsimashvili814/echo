import { PostsResponse } from "@/types/post";

export async function getPostsClient(cursor?: string): Promise<PostsResponse> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
  if (cursor) url.searchParams.append("cursor", cursor);

  const res = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}
