"use client";

import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, ChevronRight, X } from "lucide-react";
import {
  TeamMembersMultiSelect,
  type TeamMemberOption,
} from "./TeamMembersMultiSelect";

type AssignTargetModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function SelectorField({ placeholder }: { placeholder: string }) {
  return (
    <button
      type="button"
      className="flex h-14 w-full items-center justify-between rounded-xl border border-[#D0D5DD] bg-white px-4 text-left text-base text-[#98A2B3]"
    >
      <span>{placeholder}</span>
      <ChevronRight className="size-5 text-[#667085]" />
    </button>
  );
}

function DateField({ id }: { id: string }) {
  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        placeholder="Pick date"
        className="h-14 rounded-xl border-[#D0D5DD] px-4 text-base text-[#98A2B3]"
      />
      <CalendarDays className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-[#98A2B3]" />
    </div>
  );
}

export function AssignTargetModal({ isOpen, onClose }: AssignTargetModalProps) {
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<
    TeamMemberOption[]
  >([]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="rounded-3xl p-0 sm:max-w-190"
        showCloseButton={false}
      >
        <div className="p-8">
          <div className="relative pr-12">
            <DialogTitle className="text-[40px] font-semibold leading-[1.1] text-[#101928] sm:text-[34px]">
              Assign Sales Target
            </DialogTitle>
            <DialogDescription className="mt-2 text-base font-normal text-[#667085]">
              Set a target for one or more team members.
            </DialogDescription>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="absolute top-0 right-0 flex size-10 items-center justify-center rounded-full bg-[#E8EEFF]"
            >
              <X className="size-7 text-[#0B1E66]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="team-members"
                className="text-[15px] font-medium text-[#667085]"
              >
                Select Team Members
              </Label>
              <div id="team-members">
                <TeamMembersMultiSelect
                  selectedTeamMembers={selectedTeamMembers}
                  onChange={setSelectedTeamMembers}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="commission-type"
                className="text-[15px] font-medium text-[#667085]"
              >
                Commission Type
              </Label>
              <div id="commission-type">
                <SelectorField placeholder="Select Commission Type" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="target-value"
                  className="text-[15px] font-medium text-[#667085]"
                >
                  Target Value (₦)
                </Label>
                <Input
                  id="target-value"
                  type="text"
                  placeholder="Input Target Value (₦)"
                  className="h-14 rounded-xl border-[#D0D5DD] px-4 text-base text-[#98A2B3]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="period-type"
                  className="text-[15px] font-medium text-[#667085]"
                >
                  Period Type
                </Label>
                <div id="period-type">
                  <SelectorField placeholder="Select Period Type" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="period-start"
                  className="text-[15px] font-medium text-[#667085]"
                >
                  Period Start
                </Label>
                <DateField id="period-start" />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="period-end"
                  className="text-[15px] font-medium text-[#667085]"
                >
                  Period End
                </Label>
                <DateField id="period-end" />
              </div>
            </div>

            <Button
              type="submit"
              className="mt-3 h-15 w-full rounded-[10px] bg-[#0B1E66] text-base font-semibold text-white hover:bg-[#0B1E66]/90"
            >
              Assign Target
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
