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
import { X } from "lucide-react";
import { toast } from "sonner";
import { useMarketingStore } from "@/store/useMarketingStore";
import type { CreateFaqRequest, Faq } from "@/types/MarketingTypes";

type EditFaqModalProps = {
  isOpen: boolean;
  onClose: () => void;
  faq: Faq | null;
};

export function EditFaqModal({ isOpen, onClose, faq }: EditFaqModalProps) {
  const { updateFaq, updatingFaq } = useMarketingStore();
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [category, setCategory] = React.useState("");

  React.useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setCategory(faq.category);
    }
  }, [faq]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faq) return;

    const questionTrim = question.trim();
    if (!questionTrim) {
      toast.error("Please enter a question");
      return;
    }
    const answerTrim = answer.trim();
    if (!answerTrim) {
      toast.error("Please enter an answer");
      return;
    }
    const categoryTrim = category.trim();
    if (!categoryTrim) {
      toast.error("Please enter a category");
      return;
    }

    const payload: CreateFaqRequest = {
      question: questionTrim,
      answer: answerTrim,
      category: categoryTrim,
    };

    const ok = await updateFaq(faq.id, payload);

    if (!ok) {
      toast.error("Failed to update FAQ");
      return;
    }

    toast.success("FAQ updated successfully");
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!faq) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px]" showCloseButton={false}>
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-2xl font-bold text-[#101928] mb-2">
            Edit FAQ
          </DialogTitle>
          <DialogDescription className="text-[#667085] text-base font-normal">
            Update this frequently asked question
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
          id="edit-faq-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label
              htmlFor="edit-faq-question"
              className="text-[#101928] font-medium"
            >
              Question
            </Label>
            <Input
              id="edit-faq-question"
              placeholder="e.g. How do I track my order?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="focus-visible:ring-0 h-[48px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-faq-answer" className="text-[#101928] font-medium">
              Answer
            </Label>
            <textarea
              id="edit-faq-answer"
              placeholder="Enter the answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="edit-faq-category"
              className="text-[#101928] font-medium"
            >
              Category
            </Label>
            <Input
              id="edit-faq-category"
              placeholder="e.g. Shipping"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="focus-visible:ring-0 h-[48px]"
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              form="edit-faq-form"
              className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white w-full h-[52px] text-base font-medium"
              disabled={updatingFaq}
            >
              {updatingFaq ? "Updating…" : "Update FAQ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
