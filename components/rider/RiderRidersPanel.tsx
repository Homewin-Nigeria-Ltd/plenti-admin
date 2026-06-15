"use client";

import dynamic from "next/dynamic";
import RiderSearchBar from "@/components/rider/RiderSearchBar";
import RidersTable from "@/components/rider/RidersTable";
import type { AdminRider } from "@/types/RiderTypes";
import { useRiderStore } from "@/store/useRiderStore";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useDebounce } from "use-debounce";

const RiderProfileModal = dynamic(
  () => import("./RiderProfileModal").then((mod) => mod.RiderProfileModal),
  { ssr: false },
);

export default function RiderRidersPanel() {
  const router = useRouter();
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
