"use client";

import dynamic from "next/dynamic";
import RiderSearchBar from "@/components/rider/RiderSearchBar";
import RidersTable from "@/components/rider/RidersTable";
import type { AdminRider } from "@/types/RiderTypes";
import { useRiderStore } from "@/store/useRiderStore";
import * as React from "react";
import { useDebounce } from "use-debounce";

const ApplicationReviewModal = dynamic(
  () =>
    import("./ApplicationReviewModal").then((mod) => mod.ApplicationReviewModal),
  { ssr: false },
);

export default function RiderOnboardingPanel() {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [hasRequested, setHasRequested] = React.useState(false);
  const [reviewOpen, setReviewOpen] = React.useState(false);
  const [selectedRider, setSelectedRider] = React.useState<AdminRider | null>(null);

  const { onboarding, fetchOnboardingRiders } = useRiderStore();

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchOnboardingRiders({ page: 1, search: debouncedSearch });
      if (!cancelled) setHasRequested(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, fetchOnboardingRiders]);

  return (
    <>
      <RiderSearchBar value={search} onChange={setSearch} />
      <RidersTable
        variant="onboarding"
        riders={onboarding.riders}
        loading={onboarding.loading}
        hasRequested={hasRequested}
        currentPage={onboarding.currentPage}
        lastPage={onboarding.lastPage}
        perPage={onboarding.perPage}
        totalItems={onboarding.totalItems}
        onPageChange={(nextPage) =>
          fetchOnboardingRiders({ page: nextPage, search: debouncedSearch })
        }
        onRowClick={(rider) => {
          setSelectedRider(rider);
          setReviewOpen(true);
        }}
        emptyMessage="No riders in onboarding"
      />

      <ApplicationReviewModal
        isOpen={reviewOpen}
        onClose={() => {
          setReviewOpen(false);
          setSelectedRider(null);
        }}
        riderId={selectedRider?.id ?? null}
        previewRider={selectedRider}
        onReviewed={() => fetchOnboardingRiders({ page: 1, search: debouncedSearch })}
      />
    </>
  );
}
