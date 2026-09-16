"use client";

import dynamic from "next/dynamic";
import RiderSearchBar from "@/components/rider/RiderSearchBar";
import RidersTable from "@/components/rider/RidersTable";
import type { AdminRider } from "@/types/RiderTypes";
import { useRiderStore } from "@/store/useRiderStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useDebounce } from "use-debounce";

const RiderProfileModal = dynamic(
  () => import("./RiderProfileModal").then((mod) => mod.RiderProfileModal),
  { ssr: false },
);

export default function RiderRidersPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const riderIdParam = searchParams.get("riderId");
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [hasRequested, setHasRequested] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [selectedRider, setSelectedRider] = React.useState<AdminRider | null>(null);

  const {
    riders,
    loading,
    currentPage,
    lastPage,
    perPage,
    totalItems,
    fetchRiders,
  } = useRiderStore();

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchRiders({ page: 1, search: debouncedSearch });
      if (!cancelled) setHasRequested(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, fetchRiders]);

  React.useEffect(() => {
    const id = Number(riderIdParam);
    if (!Number.isFinite(id) || id <= 0) return;
    setSelectedRider((current) => (current?.id === id ? current : { id } as AdminRider));
    setProfileOpen(true);
  }, [riderIdParam]);

  return (
    <>
      <RiderSearchBar value={search} onChange={setSearch} />
      <RidersTable
        riders={riders}
        loading={loading}
        hasRequested={hasRequested}
        currentPage={currentPage}
        lastPage={lastPage}
        perPage={perPage}
        totalItems={totalItems}
        onPageChange={(nextPage) => fetchRiders({ page: nextPage, search: debouncedSearch })}
        onRowClick={(rider) => {
          setSelectedRider(rider);
          setProfileOpen(true);
        }}
      />

      <RiderProfileModal
        isOpen={profileOpen}
        onClose={() => {
          setProfileOpen(false);
          setSelectedRider(null);
          if (riderIdParam) {
            router.replace(pathname);
          }
        }}
        riderId={selectedRider?.id ?? null}
        previewRider={selectedRider}
        onOpenChat={(riderId) => router.push(`/rider/chat?riderId=${riderId}`)}
        onRiderUpdated={() =>
          fetchRiders({ page: currentPage, search: debouncedSearch })
        }
      />
    </>
  );
}
