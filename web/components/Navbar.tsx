import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="border-b bg-white w-full top-0 sticky z-50">
      <nav className="px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          Orbit
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                href={`/users/${user.id}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {user.username}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
