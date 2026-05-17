import { UserInfo } from "@/types/user";
import { cookies } from "next/headers";

export async function getUserInfo(userId: string): Promise<UserInfo | null> {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
      headers: { cookie: cookieStore.toString() },
    });

    if (!res.ok) return null;

    const { user }: { user: UserInfo } = await res.json();
    return user;
  } catch {
    return null;
  }
}
