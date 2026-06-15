"use client";

import DataTable from "@/components/common/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCompletedRides,
  getDocumentsUploadProgress,
  getInitialsFromName,
  getOnboardingStatus,
  getOnboardingStatusBadgeClass,
  getRiderAvatar,
  getRiderDateAddedLabel,
  getRiderLocation,
  getRiderPhone,
  getRiderStatus,
  getRiderStatusBadgeClass,
  getRiderVehicleLabel,
  RIDER_EMPTY,
} from "@/lib/riderDisplay";
import type { AdminRider } from "@/types/RiderTypes";
import * as React from "react";

const RIDER_COLUMNS = [
  { key: "riderName", label: "Rider Name" },
  { key: "phoneNumber", label: "Phone Number" },
  { key: "completedRides", label: "Completed Rides" },
  { key: "location", label: "Location" },
  { key: "riderStatus", label: "Rider Status" },
] as const;

const ONBOARDING_COLUMNS = [
  { key: "dateAdded", label: "Date Added" },
  { key: "riderName", label: "Rider Name" },
  { key: "phoneNumber", label: "Phone Number" },
  { key: "documentsUploaded", label: "Document Uploaded" },
  { key: "vehicle", label: "Vehicle" },
  { key: "onboardingStatus", label: "Status" },
] as const;

function riderNameCell(rider: AdminRider) {
  const avatarUrl = getRiderAvatar(rider);
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-10">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={rider.name} />
        ) : null}
        <AvatarFallback className="bg-primary text-white text-sm font-semibold">
          {getInitialsFromName(rider.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-primary-700 text-xs sm:text-sm truncate">
          {rider.name}
        </p>
        <p className="text-xs text-neutral-500 truncate">{rider.email}</p>
      </div>
    </div>
  );
}

function buildRiderTableRows(riders: AdminRider[]): Record<string, React.ReactNode>[] {
  return riders.map((rider) => {
    const status = getRiderStatus(rider);
    const statusLabel = rider.rider_status_label?.trim()
      ? rider.rider_status_label
      : status;
    return {
      riderName: riderNameCell(rider),
      phoneNumber: (
        <span className="text-neutral-700 text-xs sm:text-sm whitespace-nowrap">
          {getRiderPhone(rider) || RIDER_EMPTY}
        </span>
      ),
      completedRides: (
        <span className="text-neutral-700 text-xs sm:text-sm">
          {getCompletedRides(rider)}
        </span>
      ),
      location: (
        <span className="text-neutral-700 text-xs sm:text-sm">
          {getRiderLocation(rider)}
        </span>
      ),
      riderStatus: (
        <span className={`badge capitalize ${getRiderStatusBadgeClass(status)}`}>
          {statusLabel}
        </span>
      ),
    };
  });
}

function buildOnboardingTableRows(riders: AdminRider[]): Record<string, React.ReactNode>[] {
  return riders.map((rider) => ({
    dateAdded: (
      <span className="text-neutral-500 text-sm">{getRiderDateAddedLabel(rider)}</span>
    ),
    riderName: riderNameCell(rider),
    phoneNumber: (
      <span className="text-neutral-700 text-xs sm:text-sm whitespace-nowrap">
        {getRiderPhone(rider) || RIDER_EMPTY}
      </span>
    ),
    documentsUploaded: (
      <span className="text-neutral-700 text-xs sm:text-sm font-medium">
        {getDocumentsUploadProgress(rider)}
      </span>
    ),
    vehicle: (
      <span className="text-neutral-700 text-xs sm:text-sm">
        {getRiderVehicleLabel(rider)}
      </span>
    ),
    onboardingStatus: (
      <span className={`badge capitalize ${getOnboardingStatusBadgeClass(rider)}`}>
        {getOnboardingStatus(rider)}
      </span>
    ),
  }));
}

type RidersTableProps = {
  variant?: "riders" | "onboarding";
  riders: AdminRider[];
  loading: boolean;
  hasRequested: boolean;
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onRowClick?: (rider: AdminRider, index: number) => void;
  emptyMessage?: string;
};

export default function RidersTable({
  variant = "riders",
  riders,
  loading,
  hasRequested,
  currentPage,
  lastPage,
  perPage,
  totalItems,
  onPageChange,
  onRowClick,
  emptyMessage = "No riders available",
}: RidersTableProps) {
  const isOnboarding = variant === "onboarding";
  const columns = isOnboarding ? ONBOARDING_COLUMNS : RIDER_COLUMNS;
  const colCount = columns.length;

  const tableRows = React.useMemo(
    () => (isOnboarding ? buildOnboardingTableRows(riders) : buildRiderTableRows(riders)),
    [riders, isOnboarding],
  );

  return (
    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="bg-white rounded-xl">
        {hasRequested && !loading && riders.length > 0 ? (
          <DataTable
            columns={columns as unknown as Array<{ key: string; label: string }>}
            rows={tableRows}
            page={currentPage}
            pageCount={lastPage}
            pageSize={perPage}
            total={totalItems}
            onPageChange={onPageChange}
            onRowClick={
              onRowClick
                ? (_row, index) => {
                    const rider = riders[index];
                    if (rider) onRowClick(rider, index);
                  }
                : undefined
            }
          />
        ) : !hasRequested || loading ? (
          <div className="min-w-180">
            <div
              className="grid gap-4 px-4 py-3 border-b border-neutral-100"
              style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: colCount }).map((_, idx) => (
                <Skeleton key={idx} className="h-4 w-24" />
              ))}
            </div>
            {Array.from({ length: Math.max(6, perPage) }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="grid gap-4 px-4 py-4 border-b border-neutral-100"
                style={{ gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))` }}
              >
                <Skeleton className="h-4 w-28" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                {colCount > 4 ? <Skeleton className="h-4 w-20" /> : null}
                {colCount > 5 ? <Skeleton className="h-6 w-20 rounded-full" /> : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center my-5 text-neutral-500">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}
