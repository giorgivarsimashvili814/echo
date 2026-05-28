import { User } from "@/types/user";

export async function getCurrentUserClient(): Promise<User | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/current-user`,
      {
        credentials: "include",
      },
    );

    if (!res.ok) return null;

    const { user }: { user: User } = await res.json();
    return user;
  } catch {
    return null;
  }
}
