import type { AdminRider, RiderDocument } from "@/types/RiderTypes";

export type ApiRiderRole = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_system?: boolean;
  created_at?: string;
  updated_at?: string;
};

/** Raw rider object from `GET /api/admin/riders`. */
export type ApiRider = {
  id: number;
  name: string;
  phone: string;
  email: string;
  avatar_url?: string | null;
  avatar?: string | null;
  amount_spent?: number | string;
  total_orders?: number;
  permissions_list?: string[];
  roles?: ApiRiderRole[];
  status?: string | null;
  rider_status?: string | null;
  vehicle_type?: string | null;
  location?: string | null;
  city?: string | null;
  state?: string | null;
  created_at?: string | null;
  submitted_at?: string | null;
  documents?: RiderDocument[] | null;
  documents_uploaded?: number | null;
  documents_total?: number | null;
  completed_rides?: number;
  rating?: number | string | null;
  joined_at?: string | null;
  date_joined?: string | null;
};

export function hasRiderRole(rider: AdminRider | ApiRider): boolean {
  const roles = rider.roles ?? [];
  return roles.some((role) => role.slug === "rider");
}

export function getRiderAvatarUrl(
  rider: {
    avatar_url?: string | null;
    avatar?: string | null;
  },
): string | null {
  const url = rider.avatar_url ?? rider.avatar ?? null;
  return typeof url === "string" && url.trim() ? url.trim() : null;
}

export function normalizeAdminRider(raw: ApiRider): AdminRider {
  const status =
    raw.rider_status ??
    raw.status ??
    (hasRiderRole(raw) ? "active" : "active");

  return {
    id: raw.id,
    name: raw.name,
    phone: raw.phone,
    email: raw.email,
    avatar_url: getRiderAvatarUrl(raw),
    amount_spent: raw.amount_spent ?? 0,
    total_orders: raw.total_orders ?? 0,
    completed_rides: raw.completed_rides ?? raw.total_orders ?? 0,
    permissions_list: raw.permissions_list ?? [],
    roles: raw.roles,
    status,
    rider_status: status,
    vehicle_type: raw.vehicle_type ?? null,
    location: raw.location ?? null,
    city: raw.city ?? null,
    state: raw.state ?? null,
    created_at: raw.created_at ?? null,
    submitted_at: raw.submitted_at ?? raw.created_at ?? null,
    documents: raw.documents ?? null,
    documents_uploaded: raw.documents_uploaded ?? null,
    documents_total: raw.documents_total ?? null,
    rating: raw.rating ?? null,
    joined_at: raw.joined_at ?? raw.date_joined ?? raw.created_at ?? null,
    date_joined: raw.date_joined ?? raw.joined_at ?? raw.created_at ?? null,
  };
}

export function normalizeRidersList(raw: unknown): AdminRider[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is ApiRider => item != null && typeof item === "object")
    .map((item) => normalizeAdminRider(item as ApiRider));
}

export function filterRidersBySearch(riders: AdminRider[], search: string): AdminRider[] {
  const q = search.trim().toLowerCase();
  if (!q) return riders;

  return riders.filter((rider) => {
    const haystack = [
      rider.name,
      rider.email,
      rider.phone,
      rider.location,
      rider.city,
      rider.state,
      rider.vehicle_type,
      ...(rider.roles?.map((r) => r.name) ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

const ONBOARDING_STATUSES = new Set([
  "pending",
  "onboarding",
  "in_review",
  "in-review",
  "awaiting_approval",
  "awaiting approval",
]);

/** Riders eligible for the onboarding tab from the main riders list. */
export function filterOnboardingFromRiders(riders: AdminRider[]): AdminRider[] {
  return riders.filter((rider) => {
    if (!hasRiderRole(rider)) return false;
    const status = String(rider.rider_status ?? rider.status ?? "")
      .trim()
      .toLowerCase();
    return ONBOARDING_STATUSES.has(status);
  });
}
