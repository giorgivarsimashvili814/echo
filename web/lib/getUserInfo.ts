import { UserInfo } from "@/types/user";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export async function getUserInfo(userId: string): Promise<UserInfo | null> {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
      headers: { cookie: cookieStore.toString() },
    });

    if (res.status === 404) notFound();
    if (!res.ok) return null;

    const { user }: { user: UserInfo } = await res.json();
    return user;
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_NOT_FOUND")
      throw error;
    return null;
  }
}
