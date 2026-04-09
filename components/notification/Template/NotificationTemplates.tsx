// components/NotificationTemplates.tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import {
  CreateTemplateRequest,
  NotificationTemplate,
} from "@/types/NotificationTypes";
import { EllipsisVertical, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import CreateTemplateModal from "./CreateTemplateModal";
import { ViewTemplateModal } from "./ViewTemplateModal";

export const TAG_COLORS: Record<string, string> = {
  // Types
  transactional: "bg-[#E7F8F0] text-[#1D9460]", // Greenish
  alert: "bg-[#FFF0F0] text-[#E53E3E]", // Reddish
  promotional: "bg-[#EBF8FF] text-[#3182CE]", // Blueish
  system: "bg-[#F7FAFC] text-[#4A5568]", // Grayish

  // Channels
  email: "bg-[#FEF9C3] text-[#713F12]", // Yellowish
  push: "bg-[#F3E8FF] text-[#581C87]", // Purpleish
  in_app: "bg-[#FFEDD5] text-[#9A3412]", // Orangish
  sms: "bg-[#E0E7FF] text-[#3730A3]", // Indigo
};

const NotificationTemplates: React.FC = () => {
  const getTemplates = useNotificationsStore((s) => s.getTemplates);
  const templates = useNotificationsStore((s) => s.templates);
  const toggleTemplate = useNotificationsStore((s) => s.toggleTemplate);
  const deleteTemplate = useNotificationsStore((s) => s.deleteTemplate);
  const editTemplate = useNotificationsStore((s) => s.editTemplate);
  const [viewingTemplate, setViewingTemplate] =
    useState<NotificationTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditTemplate = async (data: CreateTemplateRequest) => {
    if (!viewingTemplate) return null;
    const isSuccess = await editTemplate(viewingTemplate.id, data);

    if (isSuccess) {
      setIsEditing(false);
      setViewingTemplate(null);
    } else {
      console.error("Template creation failed in the store.");
    }
  };

  const handleDelete = async (id: number) => {
    await deleteTemplate(id.toString());
  };

  useEffect(() => {
    getTemplates();
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (templates.length === 0) {
    return (
      <div className="h-50 w-full flex items-center justify-center">
        <p className="text-gray-00">
          No templates found. Create your first one!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => setViewingTemplate(template)}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Header: Tags and Toggle */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-2 flex-wrap">
                {/* Template Type Tag */}
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
                    TAG_COLORS[template.type.toLowerCase()] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {template.type}
                </span>

                {/* Template Channel Tag */}
                <span
                  className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
                    TAG_COLORS[template.channel.toLowerCase()] ||
                    "bg-gray-100 text-gray-600"
                  }`}
                >
                  {template.channel}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTemplate(template.id);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  template.is_active ? "bg-blue-900" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    template.is_active ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Title and Subject */}
            <h3 className="text-lg font-bold text-blue-950 mb-1">
              {template.name}
            </h3>
            <p className="text-gray-400 text-sm mb-4">{template.title}</p>

            {/* Preview Box */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-600 text-sm leading-relaxed">
                {template.message}
              </p>
            </div>

            {/* Variables */}
            <div className="flex flex-wrap gap-2 mb-6">
              {template.variables.map((variable, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-[#FEFEEB] text-[#ADA605] text-xs rounded font-mono"
                >
                  {`{{${variable}}}`}
                </span>
              ))}
            </div>

            {/* Footer: Stats and Menu */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Eye />
                  {formatNumber(template.usage_count)} uses
                </div>
                {template.last_used_at && (
                  <div>Last: {template.last_used_at}</div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild className="h-fit">
                  <button className="p-2 hover:bg-gray-100 rounded-[3px] transition-colors bg-[#E8EEFF]">
                    <EllipsisVertical size={20} className="rotate-90" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingTemplate(template);
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(template.id);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      <CreateTemplateModal
        open={isEditing}
        onOpenChange={(open) => {
          setIsEditing(open);
          if (!open) setViewingTemplate(null);
        }}
        onSubmit={handleEditTemplate}
        template={viewingTemplate}
      />
      <ViewTemplateModal
        template={isEditing ? null : viewingTemplate}
        onClose={() => setViewingTemplate(null)}
      />
    </div>
  );
};

export default NotificationTemplates;
