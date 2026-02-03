"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { AdminUsersResponse } from "@/types/UserTypes";
import api from "@/lib/api";
import { Label } from "@/components/ui/label";

const AsyncSelect = dynamic(
  () => import("react-select/async").then((mod) => mod.default),
  { ssr: false }
);

export type UserOption = { value: number; label: string };

type UserRole = "customer" | "admin";

type UserSearchSelectProps = {
  role: UserRole;
  label: string;
  value: { userId: number | null; userName: string };
  onSelect: (userId: number | null, userName: string) => void;
  id?: string;
  placeholder?: string;
  emptyMessage?: string;
  noResultsMessage?: string;
};

const DEBOUNCE_MS = 300;

const DEFAULT_MESSAGES: Record<
  UserRole,
  { placeholder: string; empty: string; noResults: string }
> = {
  customer: {
    placeholder: "Type to search customers...",
    empty: "Type to search customers",
    noResults: "No customers found",
  },
  admin: {
    placeholder: "Type to search admins...",
    empty: "Type to search admins",
    noResults: "No admins found",
  },
};

export function UserSearchSelect({
  role,
  label,
  value,
  onSelect,
  id,
  placeholder,
  emptyMessage,
  noResultsMessage,
}: UserSearchSelectProps) {
  const inputId = id ?? (role === "customer" ? "customerName" : "assignTo");
  const messages = DEFAULT_MESSAGES[role];
  const placeholders = {
    placeholder: placeholder ?? messages.placeholder,
    empty: emptyMessage ?? messages.empty,
    noResults: noResultsMessage ?? messages.noResults,
  };

  const loadOptionsTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadOptionsResolveRef = React.useRef<((options: UserOption[]) => void) | null>(null);
  const loadOptionsInputRef = React.useRef<string>("");

  const loadUserOptions = React.useCallback(
    (inputValue: string): Promise<UserOption[]> =>
      new Promise((resolve) => {
        loadOptionsResolveRef.current = resolve;
        loadOptionsInputRef.current = inputValue;
        if (loadOptionsTimeoutRef.current) clearTimeout(loadOptionsTimeoutRef.current);

        loadOptionsTimeoutRef.current = setTimeout(() => {
          const search = loadOptionsInputRef.current.trim();
          if (!search) {
            loadOptionsResolveRef.current?.([]);
            loadOptionsResolveRef.current = null;
            return;
          }
          api
            .get<AdminUsersResponse>("/api/admin/users", {
              params: { search, page: 1, role },
            })
            .then((res) => {
              const users = res.data?.data ?? [];
              const options: UserOption[] = users.map((u) => ({
                value: u.id,
                label: u.name,
              }));
              loadOptionsResolveRef.current?.(options);
              loadOptionsResolveRef.current = null;
            })
            .catch(() => {
              loadOptionsResolveRef.current?.([]);
              loadOptionsResolveRef.current = null;
            });
        }, DEBOUNCE_MS);
      }),
    [role]
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="text-[#101928] font-medium">
        {label}
      </Label>
      <AsyncSelect
        inputId={inputId}
        placeholder={placeholders.placeholder}
        loadOptions={loadUserOptions}
        value={
          value.userId != null
            ? { value: value.userId, label: value.userName }
            : null
        }
        onChange={(option: UserOption | null) => {
          onSelect(option?.value ?? null, option?.label ?? "");
        }}
        defaultOptions={[]}
        noOptionsMessage={({ inputValue }: { inputValue: string }) =>
          inputValue ? placeholders.noResults : placeholders.empty
        }
        loadingMessage={() => "Searching..."}
        isClearable
        onClear={() => onSelect(null, "")}
        classNames={{
          control: () =>
            "min-h-[48px] h-[48px] rounded-md border border-input bg-transparent shadow-xs hover:border-ring focus-within:border-ring focus-within:ring-ring/50",
          input: () => "text-sm",
          placeholder: () => "text-muted-foreground",
          menu: () =>
            "z-50 rounded-md border border-input bg-popover shadow-md",
          option: () =>
            "cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
        }}
      />
    </div>
  );
}
