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
import { Check, X, Upload } from "lucide-react";
import { toast } from "sonner";

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

  const handleRemoveImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveChanges = () => {
    toast.success("Personal information updated successfully");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-12 lg:gap-16">
          <div className="min-w-0">
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
            {profileImage ? (
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="btn-outline w-full sm:w-auto justify-center"
                  onClick={handleChangePhotoClick}
                  type="button">
                  <Upload className="size-4 mr-2" />
                  Replace
                </Button>
                <Button 
                  variant="outline" 
                  className="btn border-red-500 text-red-500 hover:bg-red-50 w-full sm:w-auto justify-center"
                  onClick={handleRemoveImage}
                  type="button">
                  <X className="size-4 mr-2" />
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="btn-outline w-full sm:w-auto justify-center"
                  onClick={handleChangePhotoClick}
                  type="button">
                  Change Photo
                </Button>
              </div>
            )}
          </div>
          <div className="relative shrink-0 mx-auto sm:mx-0 w-fit">
            <Avatar key={profileImage ? "has-image" : "no-image"} className="size-[120px] relative">
              {profileImage && <AvatarImage src={profileImage} alt="Profile" />}
              <AvatarFallback className="bg-[#E8EEFF] text-primary text-2xl font-semibold">
                OO
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
            <h2 className="font-semibold text-primary-700 text-base sm:text-lg mb-2">
              Personal Information
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Update your personal details here.
            </p>
          </div>

          <div className="w-full lg:flex-1">
            <div className="space-y-6 sm:space-y-8 mb-4 sm:mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-primary-700">
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
                  <Label htmlFor="lastName" className="text-sm font-medium text-primary-700">
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
                <Label htmlFor="email" className="text-sm font-medium text-primary-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="form-control"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium text-primary-700">
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="form-control !w-full data-[size]:!h-[56px]">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-primary-700">
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
              <Button variant="outline" className="btn btn-group-item btn-outline">
              Cancel
              </Button>
              <Button className="btn btn-group-item btn-primary" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

