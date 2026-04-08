// components/CreateCampaignModal.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import {
  CreateCampaignPayload,
  NotificationTemplate,
} from "@/types/NotificationTypes";
import { ChevronRight, X } from "lucide-react";
import React, { useEffect, useState } from "react";

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
  const { getTemplates, templates } = useNotificationsStore();
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [formData, setFormData] = useState({
    campaignName: "",
    channel: "",
    title: "",
    targetSegment: "",
    template: "",
    message: "",
    schedule: "now", // 'now' | 'later'
    time: "",
  });

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoadingTemplate(true);
        await getTemplates();
      } finally {
        setLoadingTemplate(false);
      }
    };

    if (open) {
      fetchTemplates();
    }
  }, [open, getTemplates]);

  const isFormValid = formData.campaignName.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const payload: CreateCampaignPayload = {
      name: formData.campaignName,
      subject: formData.title || "",
      message: formData.message || "",
      channel: formData.channel as "push" | "email" | "sms",
      target_audience: formData.targetSegment as
        | "all"
        | "active"
        | "inactive"
        | "new"
        | "riders",
      notification_template_id: Number(formData.template) || 0,
      scheduled_at:
        formData.schedule === "later" && formData.time
          ? new Date(formData.time).toISOString()
          : undefined,
    };
    onSubmit?.(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Template Campaign</DialogTitle>
      <DialogContent
        className="sm:max-w-[600px] p-0 gap-0 overflow-hidden"
        showCloseButton={false}
        aria-describedby={undefined}
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
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, channel: value })
                }
                value={formData.channel}
              >
                <SelectTrigger className="w-full h-12! px-4">
                  <SelectValue placeholder="Select Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Channel</SelectLabel>
                    <SelectItem value="in-app">In App</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="push">Push</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600">Target Segment</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, targetSegment: value })
                }
                value={formData.targetSegment}
              >
                <SelectTrigger className="w-full h-12! px-4">
                  <SelectValue placeholder="Select target segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Target Segment</SelectLabel>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="active">Active Users</SelectItem>
                    <SelectItem value="inactive">Inactive Users</SelectItem>
                    <SelectItem value="new">New Users</SelectItem>
                    <SelectItem value="riders">Rider</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Select Template */}
          <div className="space-y-2">
            <Label className="text-gray-600">Select Template</Label>

            {loadingTemplate ? (
              <div className="w-full h-14 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 bg-white">
                Loading templates...
              </div>
            ) : templates.length === 0 ? (
              <div className="w-full h-14 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 bg-white">
                No templates available
              </div>
            ) : (
              <Select
                onValueChange={(value) => {
                  // setFormData({ ...formData, template: value });
                  const selected = templates.find(
                    (t) => t.id.toString() === value,
                  );
                  if (selected) {
                    setFormData((prev) => ({
                      ...prev,
                      template: selected.id.toString(),
                      message: selected.message,
                      title: selected.title,
                    }));
                  }
                }}
                value={formData.template}
              >
                <SelectTrigger className="w-full h-12! px-4">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Templates</SelectLabel>
                    {templates.map((template) => (
                      <SelectItem
                        key={template.id}
                        value={template.id.toString()}
                      >
                        {template.name} ({template.channel.toUpperCase()})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            {formData.template &&
              (() => {
                const selectedTemplate = templates.find(
                  (t) => t.id.toString() === formData.template,
                );
                if (!selectedTemplate) return null;
                return (
                  <>
                    <div className="space-y-2 mt-5">
                      <Label htmlFor="campaignName" className="text-gray-600">
                        Message Title
                      </Label>
                      <Input
                        id="campaignName"
                        placeholder="e.g April fool trick"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            title: e.target.value,
                          })
                        }
                        className="h-14 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base"
                      />
                    </div>
                    <div className="mt-5">
                      <Label className="text-gray-600 mb-2 block">
                        Message Body
                      </Label>
                      <textarea
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-800 text-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </>
                );
              })()}
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

          {/* Pick Date  */}
          {formData.schedule === "later" && (
            <div className="space-y-2">
              <Label className="text-gray-600">Pick Date</Label>
              <Input
                type="datetime-local"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="h-14 w-full px-4 border border-grey-200 rounded-lg text-grey-400"
              />
            </div>
          )}

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
