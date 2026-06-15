"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  orderSwitchToKwikPath,
  orderSwitchToSendboxPath,
} from "@/data/orders";
import api from "@/lib/api";
import type { Order } from "@/types/OrderTypes";
import axios from "axios";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

const PROVIDER_OPTIONS = [
  { value: "kwik", label: "Kwik" },
  { value: "sendbox", label: "Sendbox" },
] as const;

type ProviderValue = (typeof PROVIDER_OPTIONS)[number]["value"];

function getApiErrorMessage(error: unknown): string | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (typeof data?.message === "string") return data.message;
  }
  return null;
}

function getOrderDeliveryProvider(order: Order | null): string {
  const raw =
    order?.delivery_provider ??
    order?.delivery_selection?.provider ??
    order?.delivery_economics?.delivery_provider ??
    "";
  return String(raw).toLowerCase().trim();
}

function getOrderDeliveryProviderLabel(order: Order | null): string {
  return (
    order?.delivery_provider_label ??
    order?.delivery_selection?.provider_label ??
    order?.delivery_provider ??
    order?.delivery_selection?.provider ??
    order?.delivery_economics?.delivery_provider ??
    "—"
  );
}

type DeliveryProviderSwitchSelectProps = {
  orderId: number;
  order: Order | null;
  onUpdated?: () => void | Promise<void>;
};

export function DeliveryProviderSwitchSelect({
  orderId,
  order,
  onUpdated,
}: DeliveryProviderSwitchSelectProps) {
  const [switching, setSwitching] = React.useState(false);
  const currentProvider = React.useMemo(
    () => getOrderDeliveryProvider(order),
    [order],
  );
  const [selectedProvider, setSelectedProvider] = React.useState("");

  React.useEffect(() => {
    const match = PROVIDER_OPTIONS.find((opt) => opt.value === currentProvider);
    setSelectedProvider(match?.value ?? "");
  }, [currentProvider, orderId]);

  const handleValueChange = async (value: string) => {
    const provider = value as ProviderValue;
    if (provider === currentProvider) {
      setSelectedProvider(provider);
      return;
    }

    const previous = selectedProvider;
    setSelectedProvider(provider);
    setSwitching(true);

    try {
      const path =
        provider === "kwik"
          ? orderSwitchToKwikPath(orderId)
          : orderSwitchToSendboxPath(orderId);

      const { data } = await api.post<{ status?: string; message?: string }>(
        path,
      );

      if (data?.status === "error" || data?.status === "failed") {
        setSelectedProvider(previous);
        toast.error(data?.message ?? "Failed to switch delivery provider");
        return;
      }

      const label =
        PROVIDER_OPTIONS.find((opt) => opt.value === provider)?.label ?? provider;
      toast.success(`Order switched to ${label}`);
      await onUpdated?.();
    } catch (error) {
      console.error("Error switching delivery provider =>", error);
      setSelectedProvider(previous);
      toast.error(
        getApiErrorMessage(error) ?? "Failed to switch delivery provider",
      );
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="space-y-1">
      <p className="text-[#101928] font-medium">Delivery provider</p>
      <p className="text-[#667085] text-sm">{getOrderDeliveryProviderLabel(order)}</p>
      <Select
        value={selectedProvider || undefined}
        onValueChange={(value) => void handleValueChange(value)}
        disabled={switching}
      >
        <SelectTrigger className="w-full rounded-[6px] border border-[#D0D5DD] bg-white h-11">
          {switching ? (
            <span className="flex items-center gap-2 text-sm text-[#667085]">
              <Loader2 className="size-4 animate-spin" />
              Switching provider…
            </span>
          ) : (
            <SelectValue placeholder="Switch delivery provider" />
          )}
        </SelectTrigger>
        <SelectContent>
          {PROVIDER_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
