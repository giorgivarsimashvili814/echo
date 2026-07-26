import { FindAllUsersResponse } from "@/types/user";

export async function searchUsers(
  search: string,
  cursor?: string,
  take = 5,
): Promise<FindAllUsersResponse> {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (cursor) params.set("cursor", cursor);
  params.set("take", String(take));

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?${params.toString()}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}
