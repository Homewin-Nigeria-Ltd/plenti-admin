"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { useAccountStore } from "@/store/useAccountStore";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

function nameToFirstLast(name: string): { first: string; last: string } {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export default function PersonalInformation() {
  const {
    account,
    loadingAccount,
    accountError,
    updateProfile,
    updatingProfile,
    uploadAvatar,
    uploadingAvatar,
  } = useAccountStore();
  const { first: initialFirst, last: initialLast } = React.useMemo(
    () =>
      account?.name ? nameToFirstLast(account.name) : { first: "", last: "" },
    [account]
  );
  const [firstName, setFirstName] = React.useState(initialFirst);
  const [lastName, setLastName] = React.useState(initialLast);
  // const [language, setLanguage] = React.useState("English (US)");
  const [profileImageUrl, setProfileImageUrl] = React.useState<string | null>(
    null
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (account?.name) {
      const { first, last } = nameToFirstLast(account.name);
      setFirstName(first);
      setLastName(last);
    }
  }, [account?.name]);

  const email = account?.email ?? "";
  const role = account?.role ?? "";
  const avatarUrl = profileImageUrl ?? account?.avatar_url ?? null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      if (file) toast.error("Please select a valid image (PNG, JPG).");
      return;
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    const result = await uploadAvatar(file);
    if (result.ok) {
      setProfileImageUrl(result.avatar_url);
      toast.success("Avatar uploaded successfully.");
    } else {
      toast.error(result.message);
    }
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  // const handleRemoveImage = () => {
  //   setProfileImageUrl(null);
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };

  const handleSaveChanges = async () => {
    const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
    if (!name) {
      toast.error("Please enter your name");
      return;
    }
    const avatar_url = profileImageUrl ?? account?.avatar_url ?? null;
    const ok = await updateProfile({ name, avatar_url });
    if (ok) {
      setProfileImageUrl(null);
      toast.success("Personal information updated successfully");
    } else {
      toast.error("Failed to update profile");
    }
  };

  if (loadingAccount && !account) {
    return (
      <div className="flex items-center justify-center py-12 text-primary-600">
        Loading account information…
      </div>
    );
  }

  if (accountError && !account) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {accountError}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-12 lg:gap-16">
          <div className="min-w-0">
            <h2 className="font-semibold text-[#878787] text-base sm:text-lg mb-2">
              Profile photo
            </h2>
            <p className="text-xs sm:text-sm text-[#9B9B9B] mb-4">
              This image will be displayed on your profile.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
            />
            <Button
              variant="outline"
              className="btn w-full text-[#0B1E66]"
              onClick={handleChangePhotoClick}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  <p>Uploading…</p>
                </>
              ) : (
                <p>{avatarUrl ? "Change Photo" : "Upload Photo"}</p>
              )}
            </Button>
          </div>
          <div className="relative shrink-0 mx-auto sm:mx-0 w-fit">
            <Avatar
              key={avatarUrl ? "has-image" : "no-image"}
              className="size-[120px] relative"
            >
              {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile" />}
              <AvatarFallback className="bg-[#E8EEFF] text-primary text-2xl font-semibold">
                {account?.name ? account.name.slice(0, 2).toUpperCase() : "—"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-[-3px] right-0 w-[35px] h-[35px] bg-primary rounded-full flex items-center justify-center border-2 border-white z-10">
              <Check className="size-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="w-full lg:w-[300px] shrink-0">
            <h2 className="font-semibold text-[#878787] text-base sm:text-lg mb-2">
              Personal Information
            </h2>
            <p className="text-xs sm:text-sm text-[#9B9B9B]">
              Update your personal details here.
            </p>
          </div>

          <div className="w-full lg:flex-1">
            <div className="space-y-6 sm:space-y-8 mb-4 sm:mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-sm font-medium text-primary-700"
                  >
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Oluwanifemi"
                    className="form-control"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-sm font-medium text-primary-700"
                  >
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Osunsanya"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-primary-700"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="form-control"
                />
              </div>

              {/* <div className="space-y-2">
                <Label
                  htmlFor="language"
                  className="text-sm font-medium text-primary-700"
                >
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger
                    id="language"
                    className="form-control w-full! data-size:h-[56px]!"
                  >
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="border-0">
                    <SelectItem value="English (US)">English (US)</SelectItem>
                    <SelectItem value="English (UK)">English (UK)</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-sm font-medium text-primary-700"
                >
                  Role
                </Label>
                <Input
                  id="role"
                  value={role}
                  disabled
                  className="form-control"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4">
              {/* <Button
                variant="outline"
                className="btn btn-group-item btn-outline"
                disabled={updatingProfile}
              >
                Cancel
              </Button> */}
              <Button
                className="btn btn-group-item btn-primary"
                onClick={handleSaveChanges}
                disabled={updatingProfile}
              >
                {updatingProfile ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
