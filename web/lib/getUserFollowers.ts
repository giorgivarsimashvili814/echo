import { FollowersResponse } from "@/types/user";
import { cookies } from "next/headers";

export async function getUserFollowers(
  userId: string,
): Promise<FollowersResponse> {
  const cookieStore = await cookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/followers`,
    {
      headers: {
        cookie: cookieStore.toString(),
      },
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch followers");
  return res.json();
}
