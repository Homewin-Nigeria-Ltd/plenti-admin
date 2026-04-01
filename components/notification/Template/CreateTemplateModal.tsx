// components/CreateTemplateModal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X, ChevronRight } from "lucide-react";

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    templateName: "",
    channel: "",
    subject: "",
    category: "",
    messageBody: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSubmit?.(formData);
    onOpenChange(false);
  };

  const isFormValid =
    formData.templateName.trim() &&
    formData.channel.trim() &&
    formData.subject.trim() &&
    formData.category.trim() &&
    formData.messageBody.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[600px] p-0 gap-0 overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              Create New Template
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
          {/* Row 1: Template Name & Channel */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="templateName" className="text-gray-600">
                Template Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="templateName"
                placeholder="e.g order Confirmation"
                value={formData.templateName}
                onChange={(e) =>
                  setFormData({ ...formData, templateName: e.target.value })
                }
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel" className="text-gray-600">
                Channel
              </Label>
              <button
                type="button"
                className="w-full h-12 px-4 flex items-center justify-between border border-gray-200 rounded-md text-gray-400 hover:border-gray-300 transition-colors bg-white"
              >
                <span>Select Channel</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Row 2: Subject & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-gray-600">
                Subject / Title
              </Label>
              <Input
                id="subject"
                placeholder="e.g Your order #{[order_id]} is..."
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-600">
                Category
              </Label>
              <button
                type="button"
                className="w-full h-12 px-4 flex items-center justify-between border border-gray-200 rounded-md text-gray-400 hover:border-gray-300 transition-colors bg-white"
              >
                <span>Select Category</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Message Body */}
          <div className="space-y-2">
            <Label htmlFor="messageBody" className="text-gray-600">
              Message Body <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="messageBody"
              placeholder={`Hi {[customer_name]},\n\nYour order #{[order_id]} has been confirmed and is being processed.\n\nOrder Total: ₦{[amount]}\nExpected Delivery: {[delivery_date]}\n\nThank you for shopping with Plentti!`}
              value={formData.messageBody}
              onChange={(e) =>
                setFormData({ ...formData, messageBody: e.target.value })
              }
              className="w-full min-h-[180px] p-4 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm leading-relaxed placeholder:text-gray-300"
            />
          </div>

          {/* Helper Text */}
          <p className="text-sm text-gray-500">
            Use{" "}
            <code className="text-gray-400 bg-gray-50 px-1 rounded">
              {"{{variable_name}}"}
            </code>{" "}
            for dynamic content. Variables will be auto-detected.
          </p>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid}
            className="w-full h-12 disabled:bg-blue-500 bg-[#0B1E66] text-white font-medium rounded-lg transition-colors"
          >
            Create Template
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateModal;
