"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCommissionStructuresStore } from "@/store/useCommissionStructuresStore";
import { useTargetsStore, type PeriodType } from "@/store/useTargetsStore";
import { X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  TeamMembersMultiSelect,
  type TeamMemberOption,
} from "./TeamMembersMultiSelect";

type AssignTargetModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function DateField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <Input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-14 rounded-xl border-[#D0D5DD] px-4 text-base"
      />
    </div>
  );
}

export function AssignTargetModal({ isOpen, onClose }: AssignTargetModalProps) {
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<
    TeamMemberOption[]
  >([]);
  const [commissionStructureId, setCommissionStructureId] = useState<
    number | null
  >(null);
  const [targetAmount, setTargetAmount] = useState("");
  const [periodType, setPeriodType] = useState<PeriodType>("monthly");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const { structures, loading, fetchStructures } =
    useCommissionStructuresStore();
  const { saving, error, createTarget } = useTargetsStore();

  const noCommissionAvailable = !loading && structures.length === 0;

  useEffect(() => {
    if (isOpen) {
      fetchStructures();
    }
  }, [isOpen, fetchStructures]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError(null);

    if (selectedTeamMembers.length === 0) {
      setLocalError("Please select at least one team member");
      return;
    }

    if (noCommissionAvailable) {
      setLocalError("No commission available");
      return;
    }

    if (!commissionStructureId) {
      setLocalError("Please select a commission type");
      return;
    }

    if (!targetAmount || Number(targetAmount) <= 0) {
      setLocalError("Target amount must be greater than 0");
      return;
    }

    if (!periodStart || !periodEnd) {
      setLocalError("Please select both start and end dates");
      return;
    }

    const userIds = selectedTeamMembers.map((m) => m.value);

    const success = await createTarget({
      user_id: userIds.length === 1 ? Number(userIds[0]) : userIds.map(Number),
      commission_type_id: commissionStructureId,
      target_amount: Number(targetAmount),
      period: periodType,
      start_date: periodStart,
      end_date: periodEnd,
    });

    if (success) {
      setSelectedTeamMembers([]);
      setCommissionStructureId(null);
      setTargetAmount("");
      setPeriodType("monthly");
      setPeriodStart("");
      setPeriodEnd("");
      fetchStructures();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="rounded-3xl p-0 sm:max-w-190 max-h-[96vh] flex flex-col overflow-hidden"
        showCloseButton={false}
      >
        <div className="p-8 flex flex-col min-h-0 overflow-hidden">
          <div className="relative pr-12 shrink-0">
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

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 flex-1 overflow-y-auto pr-1"
          >
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
              <Select
                value={String(commissionStructureId || "")}
                onValueChange={(value) =>
                  setCommissionStructureId(value ? Number(value) : null)
                }
                disabled={noCommissionAvailable}
              >
                <SelectTrigger className="flex items-center h-14 w-full rounded-xl border-[#D0D5DD] px-4 py-6.75 text-base">
                  <SelectValue placeholder="Select Commission Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {structures.map((structure) => (
                      <SelectItem
                        key={structure.id}
                        value={String(structure.id)}
                      >
                        {structure.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {noCommissionAvailable && (
                <p className="text-sm text-[#D42620]">
                  No commission available
                </p>
              )}
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
                  type="number"
                  placeholder="Input Target Value (₦)"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="h-14 rounded-xl border-[#D0D5DD] px-4 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="period-type"
                  className="text-[15px] font-medium text-[#667085]"
                >
                  Period Type
                </Label>
                <Select
                  value={periodType}
                  onValueChange={(value) => setPeriodType(value as PeriodType)}
                >
                  <SelectTrigger className="flex items-center w-full rounded-xl border-[#D0D5DD] px-4 py-6.75 text-base">
                    <SelectValue placeholder="Select Period Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                <DateField
                  id="period-start"
                  value={periodStart}
                  onChange={setPeriodStart}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="period-end"
                  className="text-[15px] font-medium text-[#667085]"
                >
                  Period End
                </Label>
                <DateField
                  id="period-end"
                  value={periodEnd}
                  onChange={setPeriodEnd}
                />
              </div>
            </div>

            {localError || error ? (
              <p className="text-sm text-red-600">{localError || error}</p>
            ) : null}

            <Button
              type="submit"
              disabled={saving || noCommissionAvailable}
              className="mt-3 h-15 w-full rounded-[10px] bg-[#0B1E66] text-base font-semibold text-white hover:bg-[#0B1E66]/90"
            >
              {saving ? "Assigning..." : "Assign Target"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
