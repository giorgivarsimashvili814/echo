import { FollowingResponse } from "@/types/user";
import { cookies } from "next/headers";

export async function getUserFollowing(
  userId: string,
): Promise<FollowingResponse> {
  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/following`,
    {
      headers: {
        cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch following");
  return res.json();
}
