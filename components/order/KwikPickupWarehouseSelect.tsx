"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ORDERS_API,
  orderKwikPickupWarehousePath,
} from "@/data/orders";
import api from "@/lib/api";
import {
  extractKwikPickupLocations,
  formatKwikPickupLocationLabel,
  getOrderKwikPickupWarehouseId,
} from "@/lib/normalizeKwikPickup";
import type {
  KwikPickupLocation,
  KwikPickupLocationsResponse,
  Order,
} from "@/types/OrderTypes";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import axios from "axios";

function getApiErrorMessage(error: unknown): string | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (typeof data?.message === "string") return data.message;
  }
  return null;
}

type KwikPickupWarehouseSelectProps = {
  orderId: number;
  order: Order | null;
  onUpdated?: () => void | Promise<void>;
};

export function KwikPickupWarehouseSelect({
  orderId,
  order,
  onUpdated,
}: KwikPickupWarehouseSelectProps) {
  const [locations, setLocations] = React.useState<KwikPickupLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState("");

  const assignedWarehouseId = React.useMemo(
    () => getOrderKwikPickupWarehouseId(order),
    [order],
  );

  React.useEffect(() => {
    setSelectedId(
      assignedWarehouseId != null ? String(assignedWarehouseId) : "",
    );
  }, [assignedWarehouseId, orderId]);

  React.useEffect(() => {
    let cancelled = false;

    const loadLocations = async () => {
      setLoadingLocations(true);
      try {
        const { data } = await api.get<KwikPickupLocationsResponse>(
          ORDERS_API.kwikPickupLocations,
        );
        if (cancelled) return;
        if (data?.status === "success") {
          setLocations(extractKwikPickupLocations(data));
        } else {
          setLocations([]);
          toast.error(data?.message ?? "Failed to load Kwik pickup locations");
        }
      } catch (error) {
        console.error("Error fetching Kwik pickup locations =>", error);
        if (!cancelled) {
          toast.error(
            getApiErrorMessage(error) ?? "Failed to load Kwik pickup locations",
          );
          setLocations([]);
        }
      } finally {
        if (!cancelled) setLoadingLocations(false);
      }
    };

    void loadLocations();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const handleValueChange = async (value: string) => {
    const warehouseId = Number.parseInt(value, 10);
    if (!Number.isFinite(warehouseId)) return;

    const previous = selectedId;
    setSelectedId(value);
    setSaving(true);

    try {
      const { data } = await api.put<{ status?: string; message?: string }>(
        orderKwikPickupWarehousePath(orderId),
        { warehouse_id: warehouseId },
      );

      if (data?.status === "error" || data?.status === "failed") {
        setSelectedId(previous);
        toast.error(data?.message ?? "Failed to update Kwik pickup warehouse");
        return;
      }

      toast.success("Kwik pickup warehouse updated");
      await onUpdated?.();
    } catch (error) {
      console.error("Error updating Kwik pickup warehouse =>", error);
      setSelectedId(previous);
      toast.error(
        getApiErrorMessage(error) ?? "Failed to update Kwik pickup warehouse",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-1">
      <p className="text-[#101928] font-medium">Kwik Pickup Warehouse</p>
      <Select
        value={selectedId || undefined}
        onValueChange={(value) => void handleValueChange(value)}
        disabled={loadingLocations || saving}
      >
        <SelectTrigger className="w-full rounded-[6px] border border-[#D0D5DD] bg-white h-11">
          {loadingLocations || saving ? (
            <span className="flex items-center gap-2 text-sm text-[#667085]">
              <Loader2 className="size-4 animate-spin" />
              {saving ? "Saving…" : "Loading locations…"}
            </span>
          ) : (
            <SelectValue placeholder="Select pickup warehouse" />
          )}
        </SelectTrigger>
        <SelectContent>
          {locations.length === 0 && !loadingLocations ? (
            <p className="px-3 py-2 text-sm text-[#667085]">No pickup locations found</p>
          ) : (
            locations.map((location) => (
              <SelectItem key={location.id} value={String(location.id)}>
                {formatKwikPickupLocationLabel(location)}
                {location.kwik_ready ? " (Kwik ready)" : ""}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
