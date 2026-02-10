"use client";

import AdminDetails, {
  type AdminDetailsData,
} from "@/components/user/AdminDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/store/useUserStore";
import * as React from "react";

type AdminDetailsPageClientProps = {
  adminId: string;
};

export default function AdminDetailsPageClient({
  adminId,
}: AdminDetailsPageClientProps) {
  const adminDetails = useUserStore((state) => state.adminDetails);
  const loading = useUserStore((state) => state.loadingAdminDetails);
  const error = useUserStore((state) => state.adminDetailsError);
  const fetchAdminDetails = useUserStore((state) => state.fetchAdminDetails);

  React.useEffect(() => {
    const id = Number(adminId);
    if (!Number.isFinite(id) || id <= 0) return;
    fetchAdminDetails(id);
  }, [adminId, fetchAdminDetails]);

  const data = React.useMemo<AdminDetailsData | null>(() => {
    if (!adminDetails) return null;
    const [firstName, ...rest] = (adminDetails.name ?? "").split(" ");
    const lastName = rest.join(" ");
    return {
      id: String(adminDetails.id),
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      email: adminDetails.email ?? "",
      department: adminDetails.department ?? "",
      roleTitle: adminDetails.role ?? "",
      position: adminDetails.position ?? "",
      createdBy: adminDetails.created_by_name ?? "",
      createdAt: adminDetails.joined_date ?? "",
      avatarUrl: adminDetails.avatar_url ?? null,
    };
  }, [adminDetails]);

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-[#101828]">User Management</h1>
      {loading ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <Skeleton className="size-20 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} className="h-12 rounded-md" />
            ))}
          </div>
          <Skeleton className="h-4 w-2/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-20 rounded-md lg:col-span-2" />
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-10 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      ) : error ? (
        <p className="text-sm text-[#D42620]">{error}</p>
      ) : data ? (
        <AdminDetails data={data} />
      ) : (
        <p className="text-sm text-[#667085]">No admin details found.</p>
      )}
    </div>
  );
}
