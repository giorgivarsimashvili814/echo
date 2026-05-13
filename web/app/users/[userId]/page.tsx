import UserProfile from "@/components/UserProfile";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getUserInfo } from "@/lib/getUserInfo";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function page({ params }: Props) {
  const { userId } = await params;
  const user = await getUserInfo(userId);
  const currentUser = await getCurrentUser();

  if (!user) return <div>Something went wrong</div>;

  return <UserProfile user={user} currentUser={currentUser} />;
}
