import AccountSettings from "@/components/AccountSettings";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";

export default async function MePage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  return (
    <div className="w-full max-w-170 mx-auto px-3 py-4 flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Account settings</h1>
      <AccountSettings user={currentUser} />
    </div>
  );
}