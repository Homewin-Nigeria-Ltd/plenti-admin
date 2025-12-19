"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

export default function PasswordManagement() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  return (
    <div className="flex gap-8">
      <div className="w-64 flex-shrink-0">
        <h2 className="font-semibold text-primary-700 text-lg mb-2">
          Update Password
        </h2>
        <p className="text-sm text-neutral-500">
          Last update 29th July 2023
        </p>
      </div>

      <div className="flex-1 bg-white rounded-lg border border-neutral-100 shadow-sm p-6">
        <div className="mb-6">
          <h2 className="font-semibold text-primary-700 text-lg mb-2">
            Update Password
          </h2>
          <p className="text-sm text-neutral-500">
            Enter your current password to make update
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium text-primary-700">
              Current Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-neutral-500 pointer-events-none" />
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter Password"
                className="focus-visible:ring-0 pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium text-primary-700">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-neutral-500 pointer-events-none" />
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter New Password"
                className="focus-visible:ring-0 pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-primary-700">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-neutral-500 pointer-events-none" />
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter New Password"
                className="focus-visible:ring-0 pl-10"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

