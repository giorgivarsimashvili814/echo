import { Ref } from "react";

export default function CommentSkeleton({
  ref,
}: {
  ref?: Ref<HTMLDivElement> | undefined;
}) {
  return (
    <div ref={ref} className="flex gap-1 w-full animate-pulse pb-3">
      <div className="bg-gray-200 h-8 w-8 rounded-full shrink-0" />

      <div className="flex-1 space-y-2">
        <div className="bg-gray-100 px-2 py-2 rounded-lg w-full max-w-[85%] space-y-2">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-4 bg-gray-200 rounded w-11/12" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>

        <div className="flex gap-4 items-center pl-1">
          <div className="h-3 bg-gray-200 rounded w-8" />
          <div className="h-4 bg-gray-200 rounded w-14" />
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>
      </div>
    </div>
  );
}
