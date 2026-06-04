import { PostsResponse } from "@/types/post";
import { cookies } from "next/headers";

export async function getPosts(
  cursor?: string,
  userId?: string,
): Promise<PostsResponse> {
  const cookieStore = await cookies();
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
  if (cursor) url.searchParams.append("cursor", cursor);
  if (userId) url.searchParams.append("userId", userId);

  const res = await fetch(url.toString(), {
    headers: { cookie: cookieStore.toString() },
  });
  console.log({ server: url });

  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}
