import Navbar from "@/components/Navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex w-full min-[1920px]:max-w-366 px-3 py-4">
        <main className="w-full max-w-170 m-auto flex flex-col gap-5">{children}</main>
      </div>
    </>
  );
}
