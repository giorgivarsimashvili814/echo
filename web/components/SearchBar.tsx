"use client";
import { ArrowLeft, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/lib/searchUsers";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import Image from "next/image";
import defaultAvatar from "@/public/default-avatar-3.svg";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["search-users", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: !!debouncedQuery,
  });

  if (expanded) {
    return (
      <div className="fixed top-0 left-0 w-75 z-50 bg-white px-3 py-2 flex flex-col gap-2 shadow-md border-r border-b rounded-br-lg">
        <div className="flex items-center gap-2 h-10">
          <ArrowLeft
            className="cursor-pointer shrink-0 text-gray-600 hover:text-black"
            onClick={() => {
              setExpanded(false);
              setQuery("");
            }}
          />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="h-10 w-full border-0 bg-gray-100 rounded-full px-3 outline-none focus-visible:ring-0"
          />
        </div>

        {query && (
          <div className="flex flex-col gap-1 max-h-80 overflow-y-auto pt-1">
            {isLoading ? (
              <p className="text-sm text-muted-foreground px-2 py-2">
                Searching...
              </p>
            ) : data?.users.length === 0 ? (
              <p className="text-sm text-muted-foreground px-2 py-2">
                No users found
              </p>
            ) : (
              data?.users.map((user) => (
                <Link
                  href={`/users/${user.id}`}
                  key={user.id}
                  onClick={() => setExpanded(false)}
                  className="w-full flex gap-3 items-center p-2 text-sm hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Image
                    src={user.avatar?.url ?? defaultAvatar}
                    alt={user.username}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <p className="text-md font-medium text-gray-800">
                    {user.username}
                  </p>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="bg-gray-100 flex items-center rounded-full px-2 py-2 sm:py-0 focus-within:bg-gray-200 cursor-pointer"
      onClick={() => setExpanded(true)}
    >
      <SearchIcon
        size={16}
        className="cursor-pointer sm:cursor-default shrink-0"
      />
      <Input
        readOnly
        value=""
        placeholder="Search Orbit"
        className="h-10 border-0 outline-0 focus-visible:ring-0 focus-visible:ring-offset-0 max-w-53 hidden sm:block cursor-pointer"
      />
    </div>
  );
}
