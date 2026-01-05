"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { BannerType } from "@/data/banners";

type CreateBannerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const bannerTypes: BannerType[] = ["In-page", "Full-Page"];

export function CreateBannerModal({ isOpen, onClose }: CreateBannerModalProps) {
  const [heading, setHeading] = React.useState("");
  const [subHeading, setSubHeading] = React.useState("");
  const [bannerType, setBannerType] = React.useState<BannerType | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!heading || !subHeading || !bannerType) {
      toast.error("Please fill in all fields");
      return;
    }

    // Here you would typically make an API call to create the banner
    console.log({
      heading,
      subHeading,
      bannerType,
    });

    toast.success("Banner created successfully");

    // Reset form
    setHeading("");
    setSubHeading("");
    setBannerType("");

    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setHeading("");
    setSubHeading("");
    setBannerType("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px]" showCloseButton={false}>
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-2xl font-bold text-[#101928] mb-2">
            Create New Banner
          </DialogTitle>
          <DialogDescription className="text-[#667085] text-base font-normal">
            Add a promotional banner to your homepage
          </DialogDescription>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="absolute top-0 right-0 flex items-center justify-center size-8 bg-[#E8EEFF] rounded-full hover:bg-[#E8EEFF]/80 transition-colors"
          >
            <X color="#0B1E66" size={18} />
          </button>
        </DialogHeader>

        <form
          id="create-banner-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="heading" className="text-[#101928] font-medium">
              Banner Heading
            </Label>
            <Input
              id="heading"
              placeholder="Input banner heading here"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="focus-visible:ring-0 h-[48px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subHeading" className="text-[#101928] font-medium">
              Banner Subheading
            </Label>
            <textarea
              id="subHeading"
              placeholder="Input banner Subheading"
              value={subHeading}
              onChange={(e) => setSubHeading(e.target.value)}
              className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bannerType" className="text-[#101928] font-medium">
              Banner Type
            </Label>
            <Select
              value={bannerType}
              onValueChange={(value) => setBannerType(value as BannerType)}
            >
              <SelectTrigger
                id="bannerType"
                className="w-full focus-visible:ring-0 h-[48px]"
              >
                <SelectValue placeholder="Select banner type" />
              </SelectTrigger>
              <SelectContent>
                {bannerTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              form="create-banner-form"
              className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white w-full h-[52px] text-base font-medium"
            >
              Create Banner
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
