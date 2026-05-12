import Navbar from "@/components/Navbar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex w-full min-[1920px]:max-w-366 m-auto justify-center gap-8 bg-green-300">
        <main className="w-full max-w-200  bg-red-300">{children}</main>
      </div>
    </>
  );
}
