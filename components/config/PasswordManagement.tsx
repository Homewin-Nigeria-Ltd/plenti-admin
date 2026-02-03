"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAccountStore } from "@/store/useAccountStore";

export default function PasswordManagement() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const { updatingPassword, updatePasswordError, updatePassword } =
    useAccountStore();

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }
    const ok = await updatePassword({
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    });
    if (ok) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully");
    } else {
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        <div className="w-full lg:w-[300px] shrink-0">
          <h2 className="font-semibold text-primary-700 text-base sm:text-lg mb-2">
            Update Password
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Last update 29th July 2023
          </p>
        </div>

        <div className="w-full lg:flex-1">
          <div className="space-y-6 sm:space-y-8 mb-4 sm:mb-6">
            <div className="space-y-2">
              <Label
                htmlFor="currentPassword"
                className="text-sm font-medium text-primary-700"
              >
                Current Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-500 pointer-events-none z-10" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="form-control !pl-[48px] !pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 z-10"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-primary-700"
              >
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-500 pointer-events-none z-10" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter New Password"
                  className="form-control !pl-[48px] !pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 z-10"
                >
                  {showNewPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-primary-700"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-500 pointer-events-none z-10" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter New Password"
                  className="form-control !pl-[48px] !pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 z-10"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {updatePasswordError && (
            <p className="text-sm text-red-600 mb-4">{updatePasswordError}</p>
          )}

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              className="btn btn-group-item btn-primary"
              onClick={handleUpdatePassword}
              disabled={
                updatingPassword ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
            >
              {updatingPassword ? "Updating…" : "Update Password"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
