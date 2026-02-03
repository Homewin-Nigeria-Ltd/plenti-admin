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

export type CustomerOption = { value: number; label: string };

type CustomerSearchSelectProps = {
  value: { customerId: number | null; customerName: string };
  onSelect: (customerId: number | null, customerName: string) => void;
  id?: string;
};

const DEBOUNCE_MS = 300;

export function CustomerSearchSelect({
  value,
  onSelect,
  id = "customerName",
}: CustomerSearchSelectProps) {
  const loadOptionsTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadOptionsResolveRef = React.useRef<((options: CustomerOption[]) => void) | null>(null);
  const loadOptionsInputRef = React.useRef<string>("");

  const loadCustomerOptions = React.useCallback(
    (inputValue: string): Promise<CustomerOption[]> =>
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
              params: { search, page: 1, role: "customer" },
            })
            .then((res) => {
              const users = res.data?.data ?? [];
              const options: CustomerOption[] = users.map((u) => ({
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
    []
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#101928] font-medium">
        Customer&apos;s Name
      </Label>
      <AsyncSelect
        inputId={id}
        placeholder="Type to search customers..."
        loadOptions={loadCustomerOptions}
        value={
          value.customerId != null
            ? { value: value.customerId, label: value.customerName }
            : null
        }
        onChange={(option: CustomerOption | null) => {
          onSelect(option?.value ?? null, option?.label ?? "");
        }}
        defaultOptions={[]}
        noOptionsMessage={({ inputValue }: { inputValue: string }) =>
          inputValue ? "No customers found" : "Type to search customers"
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
