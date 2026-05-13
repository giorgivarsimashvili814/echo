import Navbar from "@/components/Navbar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex w-full min-[1920px]:max-w-366 m-auto px-3 py-4 justify-center gap-8">
        <main className="w-full max-w-200">{children}</main>
      </div>
    </>
  );
}
