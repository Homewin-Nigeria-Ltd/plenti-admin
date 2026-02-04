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
import { X } from "lucide-react";
import { toast } from "sonner";

const CATEGORY_OPTIONS = [
  { value: "order", label: "Order" },
  { value: "payment", label: "Payment" },
  { value: "delivery", label: "Delivery" },
  { value: "pricing", label: "Pricing" },
  { value: "support", label: "Support" },
];

export type NewKeywordData = {
  keyword: string;
  category: string;
  response: string;
};

type AddChatbotKeywordModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: NewKeywordData) => void;
};

export default function AddChatbotKeywordModal({
  isOpen,
  onClose,
  onSave,
}: AddChatbotKeywordModalProps) {
  const [keyword, setKeyword] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [response, setResponse] = React.useState("");

  const reset = () => {
    setKeyword("");
    setCategory("");
    setResponse("");
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      toast.error("Please enter a keyword/trigger");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if (!response.trim()) {
      toast.error("Please enter a response");
      return;
    }

    const data: NewKeywordData = {
      keyword: keyword.trim(),
      category,
      response: response.trim(),
    };
    onSave?.(data);
    toast.success("Keyword added successfully");
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="max-h-[90vh] flex flex-col p-0 w-[95vw] max-w-[557px] sm:w-[557px] sm:max-w-[557px]"
        showCloseButton={false}
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100 relative">
          <DialogTitle className="text-xl sm:text-2xl font-semibold text-[#101928]">
            Add Chatbot Keyword.
          </DialogTitle>
          <DialogDescription className="text-sm text-[#667085]">
            Define a new keyword and its response for the chatbot.
          </DialogDescription>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full"
          >
            <X className="size-4 text-[#0B1E66]" />
          </button>
        </DialogHeader>

        <form
          id="add-chatbot-keyword-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 sm:space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="keyword-trigger" className="text-sm font-medium">
              Keyword/Trigger
            </Label>
            <Input
              id="keyword-trigger"
              placeholder="Input keyword / trigger"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="w-full form-control">
                <SelectValue placeholder="Select category." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="response" className="text-sm font-medium">
              Response
            </Label>
            <textarea
              id="response"
              placeholder="Input response here"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="form-control w-full min-h-[100px] resize-none"
              required
            />
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-4 border-t border-neutral-100">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-chatbot-keyword-form"
            className="btn btn-primary"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
