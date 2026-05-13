import { User } from "@/types/user";
import { cookies } from "next/headers";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/current-user`,
      {
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      },
    );

    if (!res.ok) return null;

    const { user }: { user: User } = await res.json();
    return user;
  } catch {
    return null;
  }
}
