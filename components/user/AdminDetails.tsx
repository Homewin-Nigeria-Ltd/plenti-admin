"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export type AdminDetailsData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  roleTitle: string;
  position: string;
  createdBy: string;
  createdAt: string;
  avatarUrl?: string | null;
};

type AdminDetailsProps = {
  data: AdminDetailsData;
};

const Field = ({
  //   label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div
    className={cn(
      "bg-[#F2F4F7] rounded-md px-4 py-3 text-sm text-[#667085]",
      className
    )}
  >
    {value || "—"}
  </div>
);

const getInitials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "A";

export default function AdminDetails({ data }: AdminDetailsProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-[#101928] hover:text-[#0B1E66]"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>
      <div className="flex flex-col items-center">
        <Avatar className="size-20">
          {data.avatarUrl ? (
            <AvatarImage
              src={data.avatarUrl}
              alt={`${data.firstName} ${data.lastName}`}
            />
          ) : null}
          <AvatarFallback className="bg-[#E8EEFF] text-[#0B1E66] text-2xl font-semibold">
            {getInitials(data.firstName, data.lastName)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="First name" value={data.firstName} />
        <Field label="Last name" value={data.lastName} />
        <Field label="Email" value={data.email} className="md:col-span-2" />
        <Field label="Department" value={data.department} />
        <Field label="Role" value={data.roleTitle} />
        <Field
          label="Position"
          value={data.position}
          className="md:col-span-2"
        />
      </div>

      <p className="text-xs text-[#667085]">
        Account created by{" "}
        <span className="text-[#101828] font-medium">{data.createdBy}</span> on{" "}
        {data.createdAt}
      </p>
      {/* To be worked on later  */}
      {/* 
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 space-y-2">
          <h3 className="text-sm font-semibold text-[#101828]">
            Account Management
          </h3>
          <p className="text-xs text-[#667085] max-w-xl">
            These options are essential for administrators to maintain control
            over user accounts and ensure the security and integrity of the
            platform.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button className="h-10 rounded-md bg-[#ECFDF3] text-[#027A48] text-sm font-medium flex items-center justify-center">
            Approve
          </button>
          <button className="h-10 rounded-md bg-[#FEE4E2] text-[#B42318] text-sm font-medium flex items-center justify-center">
            Reject Account
          </button>
          <button
            className="h-10 rounded-md bg-[#F2F4F7] text-[#98A2B3] text-sm font-medium flex items-center justify-center"
            disabled
          >
            Suspend
          </button>
        </div>
      </div> */}
    </div>
  );
}
