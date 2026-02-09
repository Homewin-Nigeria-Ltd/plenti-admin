"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useUserStore } from "@/store/useUserStore";
import { Skeleton } from "@/components/ui/skeleton";

const ViewUser = dynamic(() => import("@/components/user/ViewUser"), {
  ssr: false,
  loading: () => (
    <div className="text-sm text-neutral-500">Loading user details...</div>
  ),
});

export default function UserDetailsContainer({ userId }: { userId: string }) {
  const id = Number(userId);
  const {
    singleUser,
    singleUserStats,
    loadingSingleUser,
    fetchSingleUser,
    clearSingleUser,
  } = useUserStore();
  const [hasRequested, setHasRequested] = React.useState(false);

  React.useEffect(() => {
    if (!Number.isFinite(id) || id <= 0) return;
    setHasRequested(true);
    fetchSingleUser(id);
    return () => clearSingleUser();
  }, [id, fetchSingleUser, clearSingleUser]);

  if (!Number.isFinite(id) || id <= 0) {
    return <div className="text-sm text-neutral-500">Invalid user id.</div>;
  }

  if (!hasRequested || loadingSingleUser) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col items-center">
            <Skeleton className="size-24 sm:size-32 rounded-full mb-6" />
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-neutral-100 p-3"
                >
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-[53px] w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!singleUser) {
    return <div className="text-sm text-neutral-500">User not found.</div>;
  }

  return <ViewUser user={singleUser} stats={singleUserStats} />;
}
