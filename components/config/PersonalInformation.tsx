"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, ChevronRight } from "lucide-react";

export default function PersonalInformation() {
  const [firstName, setFirstName] = React.useState("Oluwanifemi");
  const [lastName, setLastName] = React.useState("Osunsanya");
  const [email] = React.useState("oluwanifemi@motobite.com");
  const [role] = React.useState("Super Admin");
  const [language, setLanguage] = React.useState("English (US)");

  return (
    <div className="flex gap-8">
      <div className="w-64 shrink-0">
        <div className="mb-8">
          <h2 className="font-semibold text-primary-700 text-lg mb-2">
            Profile photo
          </h2>
          <p className="text-sm text-neutral-500 mb-4">
            This image will be displayed on your profile.
          </p>
          <Button variant="outline" className="border-primary text-primary">
            Change Photo
          </Button>
        </div>
        <div>
          <h2 className="font-semibold text-primary-700 text-lg mb-2">
            Personal Information
          </h2>
          <p className="text-sm text-neutral-500">
            Update your personal details here.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg border border-neutral-100 shadow-sm p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-1">
            <h2 className="font-semibold text-primary-700 text-lg mb-2">
              Personal Information
            </h2>
            <p className="text-sm text-neutral-500">
              Update your personal details here.
            </p>
          </div>
          <div className="relative">
            <Avatar className="size-24">
              <AvatarFallback className="bg-primary-50 text-primary-700 text-2xl font-semibold">
                OO
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 size-6 bg-primary-700 rounded-full flex items-center justify-center">
              <Check className="size-4 text-white" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-primary-700">
              First name
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Oluwanifemi"
              className="focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-primary-700">
              Last name
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Osunsanya"
              className="focus-visible:ring-0 border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-primary-700">
              Email address
            </Label>
            <Input
              id="email"
              value={email}
              disabled
              className="bg-neutral-50 text-neutral-500 cursor-not-allowed focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-medium text-primary-700">
              Language
            </Label>
            <div className="relative">
              <Input
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="English (US)"
                className="focus-visible:ring-0 pr-10"
              />
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-neutral-500 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-primary-700">
              Role
            </Label>
            <Input
              id="role"
              value={role}
              disabled
              className="bg-neutral-50 text-neutral-500 cursor-not-allowed focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" className="border-primary text-primary">
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

