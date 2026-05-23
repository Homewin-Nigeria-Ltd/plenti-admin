import type {
  KwikPickupLocation,
  KwikPickupLocationsResponse,
} from "@/types/OrderTypes";

function normalizeKwikPickupLocation(raw: unknown): KwikPickupLocation | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const id = Number(record.id);
  if (!Number.isFinite(id)) return null;

  const name = String(record.name ?? "").trim();
  if (!name) return null;

  const location =
    record.location != null ? String(record.location).trim() || null : null;
  const address =
    record.address != null ? String(record.address).trim() || null : null;

  const lat =
    record.lat != null && Number.isFinite(Number(record.lat))
      ? Number(record.lat)
      : null;
  const lng =
    record.lng != null && Number.isFinite(Number(record.lng))
      ? Number(record.lng)
      : null;

  return {
    id,
    name,
    location,
    address,
    lat,
    lng,
    is_primary: Boolean(record.is_primary),
    has_coordinates: Boolean(record.has_coordinates),
    kwik_ready: Boolean(record.kwik_ready),
  };
}

/** `GET /api/admin/kwik/pickup-locations` — `{ status, data: [...] }` */
export function extractKwikPickupLocations(
  payload: KwikPickupLocationsResponse | unknown,
): KwikPickupLocation[] {
  if (!payload || typeof payload !== "object") return [];

  const root = payload as KwikPickupLocationsResponse;
  if (!Array.isArray(root.data)) return [];

  return root.data
    .map(normalizeKwikPickupLocation)
    .filter((item): item is KwikPickupLocation => item != null)
    .sort((a, b) => {
      if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
      if (a.kwik_ready !== b.kwik_ready) return a.kwik_ready ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

export function formatKwikPickupLocationLabel(location: KwikPickupLocation): string {
  const detail = location.address ?? location.location;
  return detail ? `${location.name} — ${detail}` : location.name;
}

export function getOrderKwikPickupWarehouseId(
  order: {
    kwik_pickup_warehouse_id?: number | null;
    pickup_warehouse_id?: number | null;
    kwik_pickup_warehouse?: { id?: number } | null;
  } | null | undefined,
): number | null {
  if (!order) return null;
  const nested = order.kwik_pickup_warehouse?.id;
  if (nested != null && Number.isFinite(Number(nested))) return Number(nested);

  const direct =
    order.kwik_pickup_warehouse_id ?? order.pickup_warehouse_id ?? null;
  if (direct != null && Number.isFinite(Number(direct))) return Number(direct);
  return null;
}
