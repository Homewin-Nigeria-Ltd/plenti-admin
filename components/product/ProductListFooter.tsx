"use client";

type ProductListFooterProps = {
  loadedCount: number;
  total: number;
  canLoadMore: boolean;
  loadingMore?: boolean;
  onLoadMore: () => void;
};

export default function ProductListFooter({
  loadedCount,
  total,
  canLoadMore,
  loadingMore = false,
  onLoadMore,
}: ProductListFooterProps) {
  const from = total === 0 ? 0 : 1;
  const to = Math.min(loadedCount, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-1 py-2 sm:flex-row">
      <p className="text-sm text-[#667085]">
        Showing {from} to {to} of {total.toLocaleString("en-US")} products
      </p>
      {canLoadMore ? (
        <button
          type="button"
          disabled={loadingMore}
          onClick={onLoadMore}
          className="h-9 rounded-lg border border-[#EAECF0] bg-white px-4 text-[13px] font-medium text-[#344054] hover:bg-[#F9FAFB] disabled:opacity-60"
        >
          {loadingMore ? "Loading..." : "Load more"}
        </button>
      ) : null}
    </div>
  );
}
