"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";

export default function PersonalInformation() {
  const [firstName, setFirstName] = React.useState("Oluwanifemi");
  const [lastName, setLastName] = React.useState("Osunsanya");
  const [email] = React.useState("oluwanifemi@motobite.com");
  const [role] = React.useState("Super Admin");
  const [language, setLanguage] = React.useState("English (US)");
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <div className="w-full lg:w-64 shrink-0">
        <div className="mb-6 lg:mb-8">
          <h2 className="font-semibold text-primary-700 text-base sm:text-lg mb-2">
            Profile photo
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mb-4">
            This image will be displayed on your profile.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/jpg"
            className="hidden"
          />
          <Button 
            variant="outline" 
            className="border-primary text-primary w-full sm:w-auto"
            onClick={handleChangePhotoClick}
            type="button">
            Change Photo
          </Button>
        </div>
        <div>
          <h2 className="font-semibold text-primary-700 text-base sm:text-lg mb-2">
            Personal Information
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Update your personal details here.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-lg border border-neutral-100 shadow-sm p-4 sm:p-6">
        <div className="mb-6">
          <div className="relative w-fit mb-4">
            <Avatar className="size-24">
              {profileImage ? (
                <AvatarImage src={profileImage} alt="Profile" />
              ) : null}
              <AvatarFallback className="bg-[#E8EEFF] text-primary text-2xl font-semibold">
                OO
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 size-6 bg-primary-700 rounded-full flex items-center justify-center">
              <Check className="size-4 text-white" />
            </div>
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

        <div className="space-y-6 mb-6">
          <div className="grid grid-cols-2 gap-6">
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
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="focus-visible:ring-0">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English (US)">English (US)</SelectItem>
                <SelectItem value="English (UK)">English (UK)</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="German">German</SelectItem>
              </SelectContent>
            </Select>
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

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4">
          <Button variant="outline" className="border-primary text-primary w-full sm:w-auto">
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

