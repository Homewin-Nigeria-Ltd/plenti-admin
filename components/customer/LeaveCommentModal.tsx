"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

type LeaveCommentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void | Promise<void>;
  isSubmitting?: boolean;
};

export function LeaveCommentModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: LeaveCommentModalProps) {
  const [commentText, setCommentText] = React.useState("");

  const handleClose = () => {
    setCommentText("");
    onClose();
  };

  React.useEffect(() => {
    if (!isOpen) setCommentText("");
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;
    await Promise.resolve(onSubmit(commentText.trim()));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-[500px] p-0" showCloseButton={false}>
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-0 border-[#EEF1F6] relative">
          <DialogTitle className="text-xl font-semibold text-[#101928]">
            Leave Comment
          </DialogTitle>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center size-8 bg-[#E8EEFF] rounded-full hover:bg-[#E8EEFF]/80"
          >
            <X className="size-4 text-[#0B1E66]" />
          </button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="ticket-comment"
              className="text-sm font-medium text-[#344054]"
            >
              Add Comment
            </label>
            <textarea
              id="ticket-comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a Comment about this ticket"
              className="w-full min-h-[120px] px-3 py-2 text-sm border border-[#D0D5DD] rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-[#1F3A78]/20 focus:border-[#1F3A78] mt-3"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white h-[48px] px-8 w-full disabled:opacity-70"
            >
              {isSubmitting ? "Submitting…" : "Leave Comment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
