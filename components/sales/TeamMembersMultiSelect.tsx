"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, ChevronRight, X } from "lucide-react";
import Select, {
  components,
  type DropdownIndicatorProps,
  type MultiValue,
  type MultiValueGenericProps,
  type MultiValueRemoveProps,
  type OptionProps,
} from "react-select";
import { useTeamMembersStore } from "@/store/useTeamMembersStore";

export type TeamMemberOption = {
  value: string;
  label: string;
  avatar?: string;
};

type TeamMembersMultiSelectProps = {
  selectedTeamMembers: TeamMemberOption[];
  onChange: (value: TeamMemberOption[]) => void;
};

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

function convertTeamMembersToOptions(
  teamMembers: Array<{ id: number; name: string; avatar_url: string | null }>,
): TeamMemberOption[] {
  return teamMembers.map((member) => ({
    value: String(member.id),
    label: member.name,
    avatar: member.avatar_url || undefined,
  }));
}

function TeamMemberOptionRow(props: OptionProps<TeamMemberOption, true>) {
  const { data, isSelected } = props;

  return (
    <components.Option {...props}>
      <div
        className={`flex items-center justify-between px-4 py-3 ${
          isSelected ? "bg-[#E8EEFF]" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={data.avatar} alt={data.label} />
            <AvatarFallback className="bg-[#F2F4F7] text-xs font-semibold text-[#475467]">
              {getInitials(data.label)}
            </AvatarFallback>
          </Avatar>
          <span className="text-[15px] text-[#1D2939]">{data.label}</span>
        </div>

        {isSelected && <Check className="size-5 text-[#0B1E66]" />}
      </div>
    </components.Option>
  );
}

function TeamMemberDropdownIndicator(
  props: DropdownIndicatorProps<TeamMemberOption, true>,
) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronRight className="size-5 text-[#667085]" />
    </components.DropdownIndicator>
  );
}
function TeamMemberMultiValueLabel(
  props: MultiValueGenericProps<TeamMemberOption, true>,
) {
  return (
    <components.MultiValueLabel {...props}>
      <div className="flex items-center gap-2">
        <Avatar className="size-7">
          <AvatarImage src={props.data.avatar} alt={props.data.label} />
          <AvatarFallback className="bg-[#F2F4F7] text-[10px] font-semibold text-[#475467]">
            {getInitials(props.data.label)}
          </AvatarFallback>
        </Avatar>
        <span className="text-[15px] font-medium text-[#1D2939]">
          {props.data.label}
        </span>
      </div>
    </components.MultiValueLabel>
  );
}

function TeamMemberMultiValueRemove(
  props: MultiValueRemoveProps<TeamMemberOption, true>,
) {
  return (
    <components.MultiValueRemove {...props}>
      <X className="size-4 text-[#98A2B3]" />
    </components.MultiValueRemove>
  );
}

export function TeamMembersMultiSelect({
  selectedTeamMembers,
  onChange,
}: TeamMembersMultiSelectProps) {
  const { teamMembers, fetchTeamMembers } = useTeamMembersStore();
  const [options, setOptions] = useState<TeamMemberOption[]>([]);

  useEffect(() => {
    fetchTeamMembers(1, 100);
  }, [fetchTeamMembers]);

  useEffect(() => {
    setOptions(convertTeamMembersToOptions(teamMembers));
  }, [teamMembers]);

  return (
    <Select<TeamMemberOption, true>
      inputId="team-members"
      options={options}
      value={selectedTeamMembers}
      onChange={(values: MultiValue<TeamMemberOption>) =>
        onChange(Array.from(values))
      }
      isMulti
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      controlShouldRenderValue
      placeholder="Click to select Team Members"
      classNames={{
        control: () =>
          "min-h-14 rounded-xl border border-[#D0D5DD] px-1 shadow-none",
        valueContainer: () => "gap-2 px-2 py-1",
        input: () => "text-[15px]",
        placeholder: () => "text-base text-[#98A2B3]",
        indicatorSeparator: () => "hidden",
        menu: () =>
          "mt-1 overflow-hidden rounded-xl border border-[#D0D5DD] bg-white shadow-none",
        menuList: () => "max-h-[360px] p-0",
        option: () => "p-0",
      }}
      styles={{
        control: (base) => ({
          ...base,
          minHeight: "56px",
          boxShadow: "none",
          borderColor: "#D0D5DD",
          ":hover": {
            borderColor: "#D0D5DD",
          },
        }),
        option: (base) => ({
          ...base,
          backgroundColor: "transparent",
          color: "inherit",
          padding: 0,
          ":active": {
            backgroundColor: "transparent",
          },
        }),
      }}
      components={{
        Option: TeamMemberOptionRow,
        DropdownIndicator: TeamMemberDropdownIndicator,
        IndicatorSeparator: () => null,
        MultiValueLabel: TeamMemberMultiValueLabel,
        MultiValueRemove: TeamMemberMultiValueRemove,
      }}
    />
  );
}
