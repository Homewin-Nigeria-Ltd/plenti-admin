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

type CreateTicketModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type TicketCategory =
  | "Complaint"
  | "Request"
  | "Enquiry"
  | "Suggestion"
  | "Refund Request";
type TicketPriority = "Low" | "Medium" | "High" | "Urgent";

export function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
  const [customerName, setCustomerName] = React.useState("");
  const [category, setCategory] = React.useState<TicketCategory | "">("");
  const [priority, setPriority] = React.useState<TicketPriority | "">("");
  const [orderId, setOrderId] = React.useState("");
  const [refundId, setRefundId] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);

  const categories: TicketCategory[] = [
    "Complaint",
    "Request",
    "Enquiry",
    "Suggestion",
    "Refund Request",
  ];
  const priorities: TicketPriority[] = ["Low", "Medium", "High", "Urgent"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !category || !priority || !subject || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Here you would typically make an API call to create the ticket
    console.log({
      customerName,
      category,
      priority,
      orderId,
      refundId,
      subject,
      description,
      files,
    });

    toast.success("Ticket created successfully");

    // Reset form
    setCustomerName("");
    setCategory("");
    setPriority("");
    setOrderId("");
    setRefundId("");
    setSubject("");
    setDescription("");
    setFiles([]);

    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setCustomerName("");
    setCategory("");
    setPriority("");
    setOrderId("");
    setRefundId("");
    setSubject("");
    setDescription("");
    setFiles([]);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter((file) => {
        const isValidType = file.type.startsWith("image/");
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        return isValidType && isValidSize;
      });

      if (validFiles.length !== selectedFiles.length) {
        toast.error("Please upload only PNG or JPG images under 5MB");
      }

      setFiles((prev) => [...prev, ...validFiles]);
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
      const validFiles = droppedFiles.filter((file) => {
        const isValidType = file.type.startsWith("image/");
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        return isValidType && isValidSize;
      });

      if (validFiles.length !== droppedFiles.length) {
        toast.error("Please upload only PNG or JPG images under 5MB");
      }

      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  // const removeFile = (index: number) => {
  //   setFiles((prev) => prev.filter((_, i) => i !== index));
  // };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + "B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + "kB";
    return (bytes / (1024 * 1024)).toFixed(2) + "MB";
  };

  const handleViewFile = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  const handleDownloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label
                  htmlFor="customerName"
                  className="text-[#101928] font-medium"
                >
                  Customer&apos;s Name
                </Label>
                <Input
                  id="customerName"
                  placeholder="Input customer's name here"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="focus-visible:ring-0 h-[48px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-[#101928] font-medium"
                >
                  Category
                </Label>
                <Select
                  value={category}
                  onValueChange={(value) =>
                    setCategory(value as TicketCategory)
                  }
                >
                  <SelectTrigger
                    id="category"
                    className="w-full focus-visible:ring-0 h-[48px]"
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
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
                  value={priority}
                  onValueChange={(value) =>
                    setPriority(value as TicketPriority)
                  }
                >
                  <SelectTrigger
                    id="priority"
                    className="w-full focus-visible:ring-0 h-[48px]"
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((pri) => (
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
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
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
                  value={refundId}
                  onChange={(e) => setRefundId(e.target.value)}
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
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              {files.length > 0 && (
                <div className="mt-4 space-y-3">
                  {files.map((file, index) => (
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
                          onClick={() => handleViewFile(file)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          aria-label="View file"
                        >
                          <Eye className="w-4 h-4 text-[#667085]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(file)}
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
