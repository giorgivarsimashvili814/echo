import { Ref } from "react";

export default function PostSkeleton({
  ref,
}: {
  ref?: Ref<HTMLDivElement> | undefined;
}) {
  return (
    <div
      ref={ref}
      className="rounded-lg p-2 flex flex-col gap-2 bg-white shadow w-full animate-pulse"
    >
      <div className="flex gap-2 items-center">
        <div className="bg-gray-200 h-10 w-10 rounded-full shrink-0"></div>
        <div className="flex flex-col gap-1">
          <div className="bg-gray-200 h-4 w-24 rounded"></div>
          <div className="bg-gray-200 h-3 w-16 rounded"></div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="bg-gray-200 h-3 w-full rounded"></div>
        <div className="bg-gray-200 h-3 w-full rounded"></div>
        <div className="bg-gray-200 h-3 w-2/3 rounded"></div>
      </div>
      <div className="flex gap-5">
        <div className="bg-gray-200 h-8 w-16 rounded-full"></div>
        <div className="bg-gray-200 h-8 w-16 rounded-full"></div>
      </div>
    </div>
  );
}
