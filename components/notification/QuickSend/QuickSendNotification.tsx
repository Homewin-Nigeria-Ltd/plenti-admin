// components/QuickSendNotification.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import { SendNotificationPayload } from "@/types/NotificationTypes";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Channel {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

function CustomerNameFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  );
}

const UserSearchSelectWithSkeleton = dynamic(
  () =>
    import("@/components/customer/UserSearchSelect").then((mod) => ({
      default: mod.UserSearchSelect,
    })),
  {
    ssr: false,
    loading: () => <CustomerNameFieldSkeleton />,
  },
);

const QuickSendNotification: React.FC = () => {
  const sendNotifcation = useNotificationsStore(
    (state) => state.sendNotification,
  );
  const { getTemplates, templates } = useNotificationsStore();
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  const [selectedTemplate, setSelctedTemplate] = useState("");
  const [sendType, setSendType] = useState<"individual" | "bulk">("individual");
  const [selectedChannel, setSelectedChannel] = useState("email");
  const [useTemplate, setUseTemplate] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [priority, setPriority] = useState<"normal" | "high" | "urgent">(
  //   "normal",
  // );
  const [formData, setFormData] = useState({
    recipient: "3",
    subject: "",
    messageBody: "",
    customerId: "3",
    customerName: "",
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

    if (useTemplate) {
      fetchTemplates();
    }
  }, [useTemplate, getTemplates]);

  const channels: Channel[] = [
    {
      id: "in-app",
      name: "In-App",
      description: "Appears in notification center",
      icon: <Bell className="w-6 h-6" />,
    },
    {
      id: "email",
      name: "Email",
      description: "Sent to user email address",
      icon: <Mail className="w-6 h-6" />,
    },
    {
      id: "sms",
      name: "SMS",
      description: "Text message to phone",
      icon: <Smartphone className="w-6 h-6" />,
    },
  ];

  const isFormValid =
    formData.customerId.trim() &&
    formData.messageBody.trim() &&
    formData.subject.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    const payload: SendNotificationPayload = {
      channel: selectedChannel.trim(),
      recipient: Number(formData.customerId),
      title: formData.subject.trim(),
      message: formData.messageBody.trim(),
    };
    setLoading(true);
    const success = await sendNotifcation(payload).finally(() =>
      setLoading(false),
    );
    if (success) {
      setFormData({
        recipient: "",
        subject: "",
        messageBody: "",
        customerId: "",
        customerName: "",
      });
      setSelctedTemplate("");
    }
  };

  // const getPriorityStyle = (p: string) => {
  //   switch (p) {
  //     case "normal":
  //       return priority === "normal"
  //         ? "bg-gray-900 text-white border-gray-900"
  //         : "bg-white text-gray-600 border-gray-200 hover:border-gray-300";
  //     case "high":
  //       return priority === "high"
  //         ? "bg-orange-500 text-white border-orange-500"
  //         : "bg-white text-gray-600 border-gray-200 hover:border-gray-300";
  //     case "urgent":
  //       return priority === "urgent"
  //         ? "bg-red-50 text-red-600 border-red-200"
  //         : "bg-white text-gray-600 border-gray-200 hover:border-gray-300";
  //     default:
  //       return "bg-white text-gray-600 border-gray-200";
  //   }
  // };

  return (
    <div className="w-full max-w-2xl my-5 p-8 bg-white rounded-2xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Quick Send Notification
        </h2>
        <p className="text-gray-500 text-sm">
          Send a one-off notification to specific users or a group
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Send Type Toggle */}
        <div className="inline-flex bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setSendType("individual")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              sendType === "individual"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Individual
          </button>
          {/* <button
            type="button"
            onClick={() => setSendType("bulk")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              sendType === "bulk"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Bulk (Multiple)
          </button> */}
        </div>

        {/* Notification Channel */}
        <div className="space-y-3">
          <Label className="text-gray-700 font-medium">
            Notification Channel
          </Label>
          <div className="grid grid-cols-3 gap-4">
            {channels.map((channel) => (
              <button
                key={channel.id}
                type="button"
                onClick={() => setSelectedChannel(channel.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedChannel === channel.id
                    ? "border-blue-900 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div
                  className={`mb-2 ${
                    selectedChannel === channel.id
                      ? "text-blue-900"
                      : "text-gray-400"
                  }`}
                >
                  {channel.icon}
                </div>
                <div
                  className={`font-medium text-sm ${
                    selectedChannel === channel.id
                      ? "text-blue-900"
                      : "text-gray-700"
                  }`}
                >
                  {channel.name}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {channel.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recipient */}
        <div className="space-y-2">
          <UserSearchSelectWithSkeleton
            id="customerName"
            role="customer"
            label="Recipient"
            placeholder="Select a recipient"
            value={{
              userId: Number(formData.customerId),
              userName: formData.customerName,
            }}
            onSelect={(userId, userName) => {
              setFormData({
                ...formData,
                customerId: String(userId),
                customerName: userName,
              });
            }}
          />
        </div>

        {/* Use Template Toggle */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <div className="font-medium text-gray-700">Use a Template</div>
            <div className="text-sm text-gray-400">
              Pre-fill subject and body from a template
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUseTemplate(!useTemplate)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useTemplate ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                useTemplate ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="space-y-2">
          {useTemplate &&
            (loadingTemplate ? (
              <div className="w-full h-14 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 bg-white">
                Loading templates...
              </div>
            ) : templates.length === 0 ? (
              <div className="w-full h-14 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 bg-white">
                No templates available
              </div>
            ) : (
              <div>
                <Label className="text-gray-600">Select Template</Label>

                <Select
                  onValueChange={(value) => {
                    // setFormData({ ...formData, template: value });
                    const selected = templates.find(
                      (t) => t.id.toString() === value,
                    );
                    if (selected) {
                      setSelctedTemplate(selected.id.toString());
                      setFormData((prev) => ({
                        ...prev,
                        messageBody: selected.message,
                        subject: selected.title,
                      }));
                    }
                  }}
                  value={selectedTemplate}
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
              </div>
            ))}
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">Subject / Title</Label>
          <input
            type="text"
            placeholder="Notification title"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="w-full h-12 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
          />
        </div>

        {/* Message Body */}
        <div className="space-y-2">
          <Label className="text-gray-700 font-medium">Message Body</Label>
          <textarea
            placeholder="Write your notification message here..."
            value={formData.messageBody}
            onChange={(e) =>
              setFormData({ ...formData, messageBody: e.target.value })
            }
            maxLength={160}
            className="w-full min-h-30 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 text-sm leading-relaxed"
          />
        </div>

        {/* Priority */}
        {/* <div className="space-y-3">
          <Label className="text-gray-700 font-medium">Priority</Label>
          <div className="flex gap-3">
            {(["normal", "high", "urgent"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-6 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${getPriorityStyle(
                  p,
                )}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div> */}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className="w-full h-12 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all"
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </form>
    </div>
  );
};

// Simple Label component since we're not using shadcn
const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => {
  return <label className={`block text-sm ${className}`}>{children}</label>;
};

export default QuickSendNotification;
