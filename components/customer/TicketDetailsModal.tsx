"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TicketStatus } from "@/data/tickets";
import {
  ChevronDown,
  Download,
  Eye,
  FileText,
  Link as LinkIcon,
  X,
} from "lucide-react";
import * as React from "react";

type TicketPriority = "Low" | "Medium" | "High" | "Urgent";
type TicketCategory =
  | "Complaint"
  | "Request"
  | "Enquiry"
  | "Suggestion"
  | "Refund Request"
  | "Delivery";

type TicketDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ticketId?: string;
};

const StatusBadge = ({ status }: { status: TicketStatus }) => {
  const getStatusStyles = (status: TicketStatus) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-700";
      case "Closed":
        return "bg-green-100 text-green-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      case "Resolved":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(
        status
      )}`}
    >
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: TicketPriority }) => {
  const getPriorityStyles = (priority: TicketPriority) => {
    switch (priority) {
      case "Low":
        return "bg-gray-100 text-gray-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyles(
        priority
      )}`}
    >
      {priority}
    </span>
  );
};

const CategoryBadge = ({ category }: { category: TicketCategory }) => {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      {category}
    </span>
  );
};

export function TicketDetailsModal({
  isOpen,
  onClose,
  ticketId = "TKT001",
}: TicketDetailsModalProps) {
  const [priority, setPriority] = React.useState<TicketPriority>("Medium");
  const [status, setStatus] = React.useState<TicketStatus>("Open");

  // Mock data - in real app, this would come from props or API
  const ticketData = {
    ticketId: "TKT001",
    created: "2024-12-11",
    updated: "2024-12-12",
    priority: "Medium" as TicketPriority,
    status: "Open" as TicketStatus,
    linkedOrder: "ORD003",
    assignedTo: "Emma Williams",
    customerName: "Adebayo Johnson",
    category: "Delivery" as TicketCategory,
    subject: "Refund request for damaged item",
    description:
      "One of the tomato paste cans in my order was damaged when it arrived. The can is dented and leaking. I would like a refund for this item.",
    files: [
      { name: "ljmNKnKkOkkkKmmkknbjbgycvT.jpg", size: 256 * 1024 },
      { name: "ljmNKnKkOkkkKmmkknbjbgycvT.jpg", size: 256 * 1024 },
    ],
    comments: [
      {
        author: "Adeola Alade",
        role: "Support Lead",
        date: "Jan 12, 2026 | 09:32AM",
        text: "Thank you for your patience. We've identified the issue causing the login error and our development team is working on a fix. We expect to have this resolved within the next 24 hours. If you have any questions, feel free to reach out",
        avatar: "https://github.com/shadcn.png",
      },
    ],
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + "B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + "kB";
    return (bytes / (1024 * 1024)).toFixed(2) + "MB";
  };

  const handleViewFile = (fileName: string) => {
    // Handle file view
    console.log("View file:", fileName);
  };

  const handleDownloadFile = (fileName: string) => {
    // Handle file download
    console.log("Download file:", fileName);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px]" showCloseButton={false}>
        <DialogHeader className="relative pb-4">
          <div className="flex items-start justify-between gap-4 pr-12">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-[#101928] mb-2">
                Ticket Details - {ticketData.ticketId}
              </DialogTitle>
              <p className="text-[#667085] text-sm">
                Created: {ticketData.created} | Updated: {ticketData.updated}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1">
                    <PriorityBadge priority={priority} />
                    <ChevronDown className="w-4 h-4 text-[#667085]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(
                    ["Low", "Medium", "High", "Urgent"] as TicketPriority[]
                  ).map((p) => (
                    <DropdownMenuItem key={p} onClick={() => setPriority(p)}>
                      {p}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1">
                    <StatusBadge status={status} />
                    <ChevronDown className="w-4 h-4 text-[#667085]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {(
                    ["Open", "Closed", "Overdue", "Resolved"] as TicketStatus[]
                  ).map((s) => (
                    <DropdownMenuItem key={s} onClick={() => setStatus(s)}>
                      {s}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-0 right-0 flex items-center justify-center size-8 bg-[#E8EEFF] rounded-full hover:bg-[#E8EEFF]/80 transition-colors"
          >
            <X color="#0B1E66" size={18} />
          </button>
        </DialogHeader>

        <div className="space-y-6">
          <div className="max-h-[70vh] overflow-auto">
            {/* Linked Order Section */}
            <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-[#EEF1F6]">
              <div className="flex items-center gap-3">
                <LinkIcon className="w-5 h-5 text-[#667085]" />
                <div>
                  <p className="text-[#667085] text-sm font-medium">
                    Linked Order
                  </p>
                  <p className="text-[#101928] text-lg font-semibold">
                    {ticketData.linkedOrder}
                  </p>
                </div>
              </div>
              <Button className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white h-9 px-4">
                View Order
              </Button>
            </div>

            {/* Ticket Information Grid */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Assigned To
                </p>
                <p className="text-[#101928] text-base font-medium">
                  {ticketData.assignedTo}
                </p>
              </div>
              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Customer Name
                </p>
                <p className="text-[#101928] text-base font-medium">
                  {ticketData.customerName}
                </p>
              </div>
              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Category
                </p>
                <CategoryBadge category={ticketData.category} />
              </div>
            </div>

            {/* Subject and Description */}
            <div className="space-y-4">
              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Subject
                </p>
                <p className="text-[#101928] text-base font-medium">
                  {ticketData.subject}
                </p>
              </div>
              <div>
                <p className="text-[#667085] text-sm font-medium mb-1">
                  Description
                </p>
                <p className="text-[#101928] text-base leading-relaxed">
                  {ticketData.description}
                </p>
              </div>
            </div>

            {/* Supporting Document Section */}
            <div className="space-y-3">
              <p className="text-[#101928] text-base font-medium">
                Supporting Document
              </p>
              <div className="space-y-3">
                {ticketData.files.map((file, index) => (
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
                        onClick={() => handleViewFile(file.name)}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="View file"
                      >
                        <Eye className="w-4 h-4 text-[#667085]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadFile(file.name)}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Download file"
                      >
                        <Download className="w-4 h-4 text-[#667085]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              <p className="text-[#101928] text-base font-medium">Comments</p>
              <div className="space-y-4">
                {ticketData.comments.map((comment, index) => (
                  <div key={index} className="flex gap-3">
                    <Avatar className="size-10">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback>
                        {comment.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-[#101928] text-sm leading-relaxed">
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-[#101928] text-sm font-medium">
                          {comment.author}
                        </p>
                        <span className="text-[#667085] text-sm">
                          {comment.date}
                        </span>
                        <span className="text-[#667085] text-sm">•</span>
                        <span className="text-[#667085] text-sm">
                          {comment.role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <DialogFooter className="flex items-center gap-4 pt-4 border-t border-[#EEF1F6]">
            <Button
              variant="outline"
              className="flex-1 border-[#1F3A78] text-[#1F3A78] hover:bg-[#E8EEFF] h-[48px]"
            >
              Initiate Response
            </Button>
            <Button className="flex-1 bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white h-[48px]">
              Leave Comment
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
