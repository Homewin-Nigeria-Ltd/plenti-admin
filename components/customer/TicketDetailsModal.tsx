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
import { ChevronDown, FileText, X, Eye, Download } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { useSupportStore } from "@/store/useSupportStore";
import type {
  SupportTicketDetail,
  TicketStatusApi,
} from "@/types/SupportTypes";

type TicketDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  ticketId?: number | string;
};

function formatLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const STATUS_OPTIONS: TicketStatusApi[] = [
  "open",
  "in_progress",
  "waiting_user",
  "resolved",
  "closed",
];

const STATUS_LABELS: Record<TicketStatusApi, string> = {
  open: "Open",
  in_progress: "In Progress",
  waiting_user: "Waiting User",
  resolved: "Resolved",
  closed: "Closed",
};

const PRIORITY_OPTIONS = ["low", "medium", "high", "urgent"] as const;

const StatusBadge = ({ status }: { status: TicketStatusApi }) => {
  const label = STATUS_LABELS[status] ?? formatLabel(status);
  const styles: Record<TicketStatusApi, string> = {
    open: "bg-blue-100 text-blue-700",
    in_progress: "bg-amber-100 text-amber-700",
    waiting_user: "bg-orange-100 text-orange-700",
    resolved: "bg-green-200 text-green-800",
    closed: "bg-green-100 text-green-700",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: string }) => {
  const label = formatLabel(priority);
  const styles: Record<string, string> = {
    low: "bg-gray-100 text-gray-700",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-800",
  };
  const key = priority.toLowerCase();
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[key] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </span>
  );
};

const CategoryBadge = ({ category }: { category: string }) => (
  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#E8EEFF] text-[#0B1E66]">
    {formatLabel(category)}
  </span>
);

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export function TicketDetailsModal({
  isOpen,
  onClose,
  ticketId,
}: TicketDetailsModalProps) {
  const {
    singleTicket,
    loadingSingleTicket,
    singleTicketError,
    fetchSingleTicket,
    clearSingleTicket,
    updateTicketPriority,
    updatingPriority,
    updateTicketStatus,
    updatingStatus,
  } = useSupportStore();

  React.useEffect(() => {
    if (isOpen && ticketId != null) {
      fetchSingleTicket(ticketId);
    }
  }, [isOpen, ticketId, fetchSingleTicket]);

  const handleClose = () => {
    clearSingleTicket();
    onClose();
  };

  const ticket = singleTicket as SupportTicketDetail | null;
  const attachments = ticket?.attachments ?? [];
  const replies = ticket?.replies ?? [];

  const [displayPriority, setDisplayPriority] =
    React.useState<string>("medium");
  const [displayStatus, setDisplayStatus] =
    React.useState<TicketStatusApi>("open");

  React.useEffect(() => {
    if (ticket) {
      setDisplayPriority(ticket.priority);
      setDisplayStatus(ticket.status);
    }
  }, [ticket]);

  const handlePriorityChange = async (priority: string) => {
    if (!ticket || priority === ticket.priority) return;
    const previous = displayPriority;
    setDisplayPriority(priority);
    const ok = await updateTicketPriority(ticket.id, priority);
    if (!ok) {
      setDisplayPriority(previous);
      toast.error("Failed to update priority");
    } else {
      toast.success("Priority updated");
    }
  };

  const handleStatusChange = async (status: TicketStatusApi) => {
    if (!ticket || status === ticket.status) return;
    const previous = displayStatus;
    setDisplayStatus(status);
    const ok = await updateTicketStatus(ticket.id, status);
    if (!ok) {
      setDisplayStatus(previous);
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-[800px]" showCloseButton={false}>
        <DialogHeader className="relative pb-4">
          {loadingSingleTicket ? (
            <>
              <DialogTitle className="sr-only">
                Loading ticket details
              </DialogTitle>
              <div className="h-8 bg-[#EEF1F6] rounded w-2/3 mb-2 animate-pulse" />
              <div className="h-4 bg-[#EEF1F6] rounded w-1/2 animate-pulse" />
            </>
          ) : singleTicketError ? (
            <>
              <DialogTitle className="sr-only">Ticket details</DialogTitle>
              <p className="text-[#D42620] text-sm">{singleTicketError}</p>
            </>
          ) : ticket ? (
            <div className="flex items-start justify-between gap-4 pr-12">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-[#101928] mb-2">
                  Ticket — {ticket.ticket_number}
                </DialogTitle>
                <p className="text-[#667085] text-sm">
                  Created: {formatDate(ticket.created_at)} | Updated:{" "}
                  {formatDate(ticket.updated_at)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      disabled={updatingPriority}
                      className="flex items-center gap-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1F3A78]/20 disabled:opacity-60"
                    >
                      <PriorityBadge priority={displayPriority} />
                      <ChevronDown className="w-4 h-4 text-[#667085]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[140px]">
                    {PRIORITY_OPTIONS.map((p) => (
                      <DropdownMenuItem
                        key={p}
                        onClick={() => void handlePriorityChange(p)}
                        disabled={updatingPriority}
                      >
                        {formatLabel(p)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      disabled={updatingStatus}
                      className="flex items-center gap-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1F3A78]/20 disabled:opacity-60"
                    >
                      <StatusBadge status={displayStatus} />
                      <ChevronDown className="w-4 h-4 text-[#667085]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[140px]">
                    {STATUS_OPTIONS.map((s) => (
                      <DropdownMenuItem
                        key={s}
                        onClick={() => void handleStatusChange(s)}
                        disabled={updatingStatus}
                      >
                        {STATUS_LABELS[s]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="absolute top-0 right-0 flex items-center justify-center size-8 bg-[#E8EEFF] rounded-full hover:bg-[#E8EEFF]/80 transition-colors"
          >
            <X color="#0B1E66" size={18} />
          </button>
        </DialogHeader>

        {!loadingSingleTicket && !singleTicketError && ticket && (
          <div className="space-y-6">
            <div className="max-h-[70vh] overflow-auto space-y-6">
              {/* Customer & assignee */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-[#667085] text-sm font-medium mb-1">
                    Customer
                  </p>
                  <p className="text-[#101928] text-base font-medium">
                    {ticket.user?.name ?? "—"}
                  </p>
                  {ticket.user?.email && (
                    <p className="text-[#667085] text-sm">
                      {ticket.user.email}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-[#667085] text-sm font-medium mb-1">
                    Assigned To
                  </p>
                  <p className="text-[#101928] text-base font-medium">
                    {ticket.assigned_admin?.name ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[#667085] text-sm font-medium mb-1">
                    Category
                  </p>
                  <CategoryBadge category={ticket.category} />
                </div>
              </div>

              {/* Subject & description */}
              <div className="space-y-4">
                <div>
                  <p className="text-[#667085] text-sm font-medium mb-1">
                    Subject
                  </p>
                  <p className="text-[#101928] text-base font-medium">
                    {ticket.subject}
                  </p>
                </div>
                <div>
                  <p className="text-[#667085] text-sm font-medium mb-1">
                    Description
                  </p>
                  <p className="text-[#101928] text-base leading-relaxed whitespace-pre-wrap">
                    {ticket.description}
                  </p>
                </div>
              </div>

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[#101928] text-base font-medium">
                    Attachments
                  </p>
                  <div className="space-y-3">
                    {attachments.map((file, index) => (
                      <div
                        key={file.id ?? index}
                        className="flex items-center gap-3 p-3 bg-white border border-[#EEF1F6] rounded-lg"
                      >
                        <FileText className="w-5 h-5 text-[#667085] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[#101928] font-medium truncate">
                            {file.file_name ?? file.url ?? "Attachment"}
                          </p>
                          {file.size != null && (
                            <p className="text-xs text-[#667085]">
                              {formatFileSize(file.size)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {file.url && (
                            <>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="View file"
                              >
                                <Eye className="w-4 h-4 text-[#667085]" />
                              </a>
                              <a
                                href={file.url}
                                download={file.file_name}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Download file"
                              >
                                <Download className="w-4 h-4 text-[#667085]" />
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Replies / comments */}
              <div className="space-y-4">
                <p className="text-[#101928] text-base font-medium">
                  Replies {replies.length > 0 && `(${replies.length})`}
                </p>
                {replies.length === 0 ? (
                  <p className="text-[#667085] text-sm">No replies yet.</p>
                ) : (
                  <div className="space-y-4">
                    {replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <Avatar className="size-10 shrink-0">
                          <AvatarImage
                            src={reply.user?.avatar_url ?? undefined}
                          />
                          <AvatarFallback>
                            {reply.user?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-[#101928] text-sm leading-relaxed whitespace-pre-wrap">
                            {reply.body}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[#101928] text-sm font-medium">
                              {reply.user?.name ?? "Support"}
                            </span>
                            <span className="text-[#667085] text-sm">
                              {reply.created_at
                                ? formatDate(reply.created_at)
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
        )}
      </DialogContent>
    </Dialog>
  );
}
