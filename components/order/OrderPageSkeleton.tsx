import { Skeleton } from "@/components/ui/skeleton";
import { PAGE_SIZE } from "@/lib/constant";

const SKELETON_STAT_COUNT = 5;
const SKELETON_TABLE_ROWS = Math.min(8, PAGE_SIZE);

export function OrderPageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading orders">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {Array.from({ length: SKELETON_STAT_COUNT }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl" />
        ))}
      </div>
      <div className="border border-[#F0F2F5] rounded-xl h-12 flex items-center gap-2 p-2 px-4 shadow-sm bg-white">
        <Skeleton className="size-5 shrink-0 rounded" />
        <Skeleton className="h-4 flex-1 max-w-md rounded" />
      </div>
      <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-xs min-w-0">
        <div className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-neutral-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
        {Array.from({ length: SKELETON_TABLE_ROWS }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid grid-cols-6 gap-4 px-4 py-4 border-b border-neutral-100"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="space-y-2 min-w-0 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-3">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
