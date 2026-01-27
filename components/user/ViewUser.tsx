"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, UserX } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { AdminUser, UserStats } from "@/types/UserTypes";
import { ApproveUserModal } from "./ApproveUserModal";
import { RejectUserModal } from "./RejectUserModal";
import { SuspendUserModal } from "./SuspendUserModal";

type ViewUserProps = {
  user: AdminUser;
  stats: UserStats | null;
};

function splitName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const firstName = parts[0] ?? "";
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
  return { firstName, lastName };
}

function getInitialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || "U";
}

export default function ViewUser({ user, stats }: ViewUserProps) {
  const { firstName, lastName } = splitName(user.name);
  const [position, setPosition] = React.useState(user.position || "Executive");
  const [isApproveModalOpen, setIsApproveModalOpen] = React.useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = React.useState(false);

  const userName = user.name;

  const handleApprove = () => {
    toast.success("User account approved successfully");
  };

  const handleReject = () => {
    toast.error("User account rejected");
  };

  const handleSuspend = () => {
    toast.warning("User account suspended");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        <div className="flex flex-col items-center">
          <Avatar className="size-24 sm:size-32 mb-6">
            {user.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={user.name} />
            ) : null}
            <AvatarFallback className="bg-primary text-white text-2xl sm:text-3xl font-semibold">
              {getInitialsFromName(user.name)}
            </AvatarFallback>
          </Avatar>

          {stats ? (
            <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div className="rounded-lg border border-neutral-100 p-3">
                <p className="text-xs text-neutral-500">Total revenue</p>
                <p className="font-semibold text-primary">
                  {stats.total_revenue}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-100 p-3">
                <p className="text-xs text-neutral-500">Total orders</p>
                <p className="font-semibold text-primary">
                  {stats.total_orders}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-100 p-3">
                <p className="text-xs text-neutral-500">Refunds</p>
                <p className="font-semibold text-primary">{stats.refunds}</p>
              </div>
              <div className="rounded-lg border border-neutral-100 p-3">
                <p className="text-xs text-neutral-500">Net profit</p>
                <p className="font-semibold text-primary">{stats.net_profit}</p>
              </div>
            </div>
          ) : null}

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-neutral-500 font-medium">
                First Name
              </label>
              <Input
                value={firstName}
                readOnly
                className="form-control bg-neutral-50! border-0! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-neutral-500 font-medium block">
                Last Name
              </label>
              <Input
                value={lastName}
                readOnly
                className="form-control bg-neutral-50! border-0! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs sm:text-sm text-neutral-500 font-medium">
                Email
              </label>
              <Input
                type="email"
                value={user.email}
                readOnly
                className="form-control bg-neutral-50! border-0! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs sm:text-sm text-neutral-500 font-medium">
                Phone
              </label>
              <Input
                value={user.phone ?? "-"}
                readOnly
                className="form-control bg-neutral-50! border-0! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-neutral-500 font-medium block">
                Department
              </label>
              <Input
                value={user.department ?? "-"}
                readOnly
                className="form-control bg-neutral-50! border-0! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-neutral-500 font-medium block">
                Role
              </label>
              <Input
                value={user.role ?? "-"}
                readOnly
                className="form-control bg-neutral-50! border-0! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs sm:text-sm text-neutral-500 font-medium">
                Position
              </label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger className="form-control bg-neutral-50! border-0! w-full! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Executive">Executive</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 text-center px-4">
            <p className="text-xs sm:text-sm text-neutral-500">
              Account created by{" "}
              <span className="font-medium text-neutral-700">
                {user.created_by_name ?? "System"}
              </span>{" "}
              • Joined{" "}
              <span className="font-medium text-neutral-700">
                {user.joined_date}
              </span>{" "}
              • Updated{" "}
              <span className="font-medium text-neutral-700">
                {user.last_updated}
              </span>
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-4 sm:pt-6 lg:pt-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            <div className="flex-1">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-primary-700 mb-2">
                Account Management
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-neutral-500">
                These options are essential for administrators to maintain
                control over user accounts and ensure the security and integrity
                of the platform.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4 w-full lg:w-auto lg:min-w-[280px]">
              <Button
                onClick={() => setIsApproveModalOpen(true)}
                variant={undefined}
                className="btn btn-success w-full font-medium flex items-center gap-3 justify-start"
              >
                <div className="size-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="size-4" />
                </div>
                Approve
              </Button>
              <Button
                onClick={() => setIsRejectModalOpen(true)}
                variant={undefined}
                className="btn btn-danger w-full font-medium flex items-center gap-3 justify-start"
              >
                <div className="size-6 rounded-md bg-white/20 flex items-center justify-center">
                  <X className="size-4" />
                </div>
                Reject Account
              </Button>
              <Button
                onClick={() => setIsSuspendModalOpen(true)}
                variant={undefined}
                className="btn btn-neutral w-full font-medium flex items-center gap-3 justify-start"
              >
                <div className="size-6 rounded-full bg-white/20 flex items-center justify-center">
                  <UserX className="size-4" />
                </div>
                Suspend
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ApproveUserModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        userName={userName}
        onConfirm={handleApprove}
      />
      <RejectUserModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        userName={userName}
        onConfirm={handleReject}
      />
      <SuspendUserModal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        userName={userName}
        onConfirm={handleSuspend}
      />
    </div>
  );
}
