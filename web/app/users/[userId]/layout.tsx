import Navbar from "@/components/Navbar";
import UserProfile from "@/components/UserProfile";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getUserInfo } from "@/lib/getUserInfo";
import { notFound } from "next/navigation";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const user = await getUserInfo(userId);
  if (!user) notFound();
  const currentUser = await getCurrentUser();

  return (
    <>
      <Navbar />
      <div className="flex w-full min-[1920px]:max-w-366 px-3 py-4 m-auto">
        <main className="w-full max-w-170 m-auto flex flex-col gap-5">
          <UserProfile user={user} currentUser={currentUser} />
          {children}
        </main>
      </div>
    </>
  );
}
