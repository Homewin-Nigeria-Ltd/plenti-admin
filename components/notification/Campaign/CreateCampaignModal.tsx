// components/CreateCampaignModal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, ChevronRight } from "lucide-react";

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    campaignName: "",
    channel: "",
    targetSegment: "",
    template: "",
    schedule: "now", // 'now' | 'later'
  });

  const isFormValid = formData.campaignName.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSubmit?.(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-semibold text-gray-900">
                Create Campaign
              </DialogTitle>
              <p className="text-gray-500 text-sm mt-1">
                Send bulk notifications to your user segments
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-6">
          {/* Campaign Name */}
          <div className="space-y-2">
            <Label htmlFor="campaignName" className="text-gray-600">
              Campaign Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="campaignName"
              placeholder="e.g April fool trick"
              value={formData.campaignName}
              onChange={(e) =>
                setFormData({ ...formData, campaignName: e.target.value })
              }
              className="h-14 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base"
            />
          </div>

          {/* Channel & Target Segment */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-600">Channel</Label>
              <button
                type="button"
                className="w-full h-14 px-4 flex items-center justify-between border border-gray-200 rounded-lg text-gray-400 hover:border-gray-300 transition-colors bg-white"
              >
                <span>Select Channel</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600">Target Segment</Label>
              <button
                type="button"
                className="w-full h-14 px-4 flex items-center justify-between border border-gray-200 rounded-lg text-gray-400 hover:border-gray-300 transition-colors bg-white"
              >
                <span>Select target segment</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Select Template */}
          <div className="space-y-2">
            <Label className="text-gray-600">Select Template</Label>
            <button
              type="button"
              className="w-full h-14 px-4 flex items-center justify-between border border-gray-200 rounded-lg text-gray-400 hover:border-gray-300 transition-colors bg-white"
            >
              <span>Select a template</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Schedule Options */}
          <RadioGroup
            value={formData.schedule}
            onValueChange={(value) =>
              setFormData({ ...formData, schedule: value })
            }
            className="flex items-center gap-8"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem
                value="now"
                id="now"
                className="h-5 w-5 border-2 border-blue-900 text-blue-900 data-[state=checked]:border-blue-900 data-[state=checked]:bg-blue-900"
              />
              <Label
                htmlFor="now"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Send Now
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem
                value="later"
                id="later"
                className="h-5 w-5 border-2 border-gray-300 text-blue-900 data-[state=checked]:border-blue-900 data-[state=checked]:bg-blue-900"
              />
              <Label
                htmlFor="later"
                className="text-gray-700 font-normal cursor-pointer"
              >
                Schedule Later
              </Label>
            </div>
          </RadioGroup>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid}
            className="w-full h-14 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all text-base"
          >
            Create Campaign
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCampaignModal;
