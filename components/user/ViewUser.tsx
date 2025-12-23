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
import type { User } from "@/data/users";
import { ApproveUserModal } from "./ApproveUserModal";
import { RejectUserModal } from "./RejectUserModal";
import { SuspendUserModal } from "./SuspendUserModal";

type ViewUserProps = {
  user: User;
};

export default function ViewUser({ user }: ViewUserProps) {
  const [position, setPosition] = React.useState(user.position || "Execuetive");
  const [isApproveModalOpen, setIsApproveModalOpen] = React.useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = React.useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const userName = `${user.firstName} ${user.lastName}`;

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
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
            ) : null}
            <AvatarFallback className="bg-primary text-white text-2xl sm:text-3xl font-semibold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-neutral-500 font-medium">First Name</label>
              <Input
                value={user.firstName}
                readOnly
                className="bg-neutral-50 border-0 focus-visible:ring-0 h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-neutral-500 font-medium block">Last Name</label>
              <Input
                value={user.lastName}
                readOnly
                className="bg-neutral-50 border-0 focus-visible:ring-0 h-11"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs sm:text-sm text-neutral-500 font-medium">Email</label>
              <Input
                type="email"
                value={user.email}
                readOnly
                className="bg-neutral-50 border-0 focus-visible:ring-0 h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-neutral-500 font-medium block">Department</label>
              <Input
                value={user.department || "Enjoyment"}
                readOnly
                className="bg-neutral-50 border-0 focus-visible:ring-0 h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm text-neutral-500 font-medium block">Role</label>
              <Input
                value={user.role || "Chairman"}
                readOnly
                className="bg-neutral-50 border-0 focus-visible:ring-0 h-11"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs sm:text-sm text-neutral-500 font-medium">Position</label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger className="w-full bg-neutral-50 border-0 focus-visible:ring-0 h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Execuetive">Execuetive</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {user.createdBy && user.createdDate && (
            <div className="mt-4 sm:mt-6 text-center px-4">
              <p className="text-xs sm:text-sm text-neutral-500">
                Account created by: <span className="font-medium text-neutral-700">{user.createdBy}</span> on{" "}
                <span className="font-medium text-neutral-700">{user.createdDate}</span>
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-neutral-100 pt-4 sm:pt-6 lg:pt-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            <div className="flex-1">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-primary-700 mb-2">
                Account Management
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-neutral-500">
                These options are essential for administrators to maintain control over user accounts and ensure the security and integrity of the platform.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:gap-4 w-full lg:w-auto lg:min-w-[280px]">
              <Button
                onClick={() => setIsApproveModalOpen(true)}
                className="w-full bg-[#0F973D] hover:bg-[#0d7d33] text-white h-12 font-medium flex items-center gap-3 justify-start">
                <div className="size-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="size-4" />
                </div>
                Approve
              </Button>
              <Button
                onClick={() => setIsRejectModalOpen(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white h-12 font-medium flex items-center gap-3 justify-start">
                <div className="size-6 rounded-md bg-white/20 flex items-center justify-center">
                  <X className="size-4" />
                </div>
                Reject Account
              </Button>
              <Button
                onClick={() => setIsSuspendModalOpen(true)}
                className="w-full bg-neutral-400 hover:bg-neutral-500 text-white h-12 font-medium flex items-center gap-3 justify-start">
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
