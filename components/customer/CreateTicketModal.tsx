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
import { X, Upload, Eye, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  type TicketCategory,
  type TicketPriority,
  type CreateTicketFormData,
  initialCreateTicketFormData,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
} from "@/components/customer/createTicketForm";
import { CustomerSearchSelect } from "@/components/customer/CustomerSearchSelect";
import {
  formatFileSize,
  openFileInNewTab,
  downloadFile,
  filterValidImageFiles,
} from "@/lib/fileUtils";

type CreateTicketModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
  const [formData, setFormData] = React.useState<CreateTicketFormData>(
    initialCreateTicketFormData
  );
  const [isDragging, setIsDragging] = React.useState(false);

  const setFormField = <K extends keyof CreateTicketFormData>(
    field: K,
    value: CreateTicketFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { customerName, category, priority, subject, description, assignTo } =
      formData;
    if (!customerName || !category || !priority || !subject || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!assignTo) {
      toast.error("Please asssign ticket to an admin");
      return;
    }

    console.log({
      customerName,
      category,
      priority,
      orderId: formData.orderId,
      refundId: formData.refundId,
      subject,
      assignTo,
      description,
      files: formData.files,
    });

    toast.success("Ticket created successfully");

    setFormData(initialCreateTicketFormData);
    onClose();
  };

  const handleClose = () => {
    setFormData(initialCreateTicketFormData);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = filterValidImageFiles(selectedFiles);
      if (validFiles.length !== selectedFiles.length) {
        toast.error("Please upload only PNG or JPG images under 5MB");
      }
      setFormField("files", [...formData.files, ...validFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = filterValidImageFiles(droppedFiles);
      if (validFiles.length !== droppedFiles.length) {
        toast.error("Please upload only PNG or JPG images under 5MB");
      }
      setFormField("files", [...formData.files, ...validFiles]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[700px]" showCloseButton={false}>
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-2xl font-bold text-[#101928] mb-2">
            Create New Support Ticket
          </DialogTitle>
          <DialogDescription className="text-[#667085] text-base font-normal">
            Fill in the details below to create a new support ticket
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
          id="create-ticket-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="max-h-[70vh] overflow-auto">
            <CustomerSearchSelect
              id="customerName"
              value={{
                customerId: formData.customerId,
                customerName: formData.customerName,
              }}
              onSelect={(customerId, customerName) => {
                setFormField("customerId", customerId);
                setFormField("customerName", customerName);
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 ">
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-[#101928] font-medium"
                >
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormField("category", value as TicketCategory)
                  }
                >
                  <SelectTrigger
                    id="category"
                    className="w-full focus-visible:ring-0 h-[48px]"
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="priority"
                  className="text-[#101928] font-medium"
                >
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormField("priority", value as TicketPriority)
                  }
                >
                  <SelectTrigger
                    id="priority"
                    className="w-full focus-visible:ring-0 h-[48px]"
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_PRIORITIES.map((pri) => (
                      <SelectItem key={pri} value={pri}>
                        {pri}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderId" className="text-[#101928] font-medium">
                  Order ID{" "}
                  <span className="text-[#667085] font-normal">(optional)</span>
                </Label>
                <Input
                  id="orderId"
                  placeholder="Input order ID"
                  value={formData.orderId}
                  onChange={(e) => setFormField("orderId", e.target.value)}
                  className="focus-visible:ring-0 h-[48px]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="refundId"
                  className="text-[#101928] font-medium"
                >
                  Refund ID{" "}
                  <span className="text-[#667085] font-normal">(optional)</span>
                </Label>
                <Input
                  id="refundId"
                  placeholder="Input refund ID"
                  value={formData.refundId}
                  onChange={(e) => setFormField("refundId", e.target.value)}
                  className="focus-visible:ring-0 h-[48px]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="assignTo"
                  className="text-[#101928] font-medium"
                >
                  Assign To
                </Label>
                <Input
                  id="assignTo"
                  placeholder="Input assign to"
                  value={formData.assignTo}
                  onChange={(e) => setFormField("assignTo", e.target.value)}
                  className="focus-visible:ring-0 h-[48px]"
                />
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor="subject" className="text-[#101928] font-medium">
                Subject
              </Label>
              <Input
                id="subject"
                placeholder="Add Brief Subject Line"
                value={formData.subject}
                onChange={(e) => setFormField("subject", e.target.value)}
                className="focus-visible:ring-0 h-[48px]"
                required
              />
            </div>

            <div className="space-y-2 mb-4">
              <Label
                htmlFor="description"
                className="text-[#101928] font-medium"
              >
                Description
              </Label>
              <textarea
                id="description"
                placeholder="Detailed description of the issue"
                value={formData.description}
                onChange={(e) => setFormField("description", e.target.value)}
                className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-0 focus-visible:border-ring focus-visible:ring-ring/50 resize-none"
                required
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-2">
              <Label className="text-[#101928] font-medium">
                Supporting Document
              </Label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-[#1F3A78] bg-[#E8EEFF]"
                    : "border-[#D0D5DD] bg-[#E8EEFF]/30"
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="bg-[#1F3A78] rounded-full p-3">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-[#101928] font-semibold text-base mb-1">
                      Upload Files
                    </p>
                    <p className="text-[#667085] text-sm">
                      Click or drag image to upload PNG, JPG and are allowed
                    </p>
                  </div>
                </label>
              </div>

              {/* Display uploaded files */}
              {formData.files.length > 0 && (
                <div className="mt-4 space-y-3">
                  {formData.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white border border-[#EEF1F6] rounded-lg"
                    >
                      <div className="shrink-0">
                        <FileText className="w-5 h-5 text-[#667085]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#101928] font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-[#667085]">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openFileInNewTab(file)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          aria-label="View file"
                        >
                          <Eye className="w-4 h-4 text-[#667085]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadFile(file)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          aria-label="Download file"
                        >
                          <Download className="w-4 h-4 text-[#667085]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              form="create-ticket-form"
              className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white w-full h-[52px] text-base font-medium"
            >
              Create Ticket
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
