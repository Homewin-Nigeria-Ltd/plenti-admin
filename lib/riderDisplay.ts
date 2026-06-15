import type { AdminRider, RiderDocument, RiderDocumentStatus } from "@/types/RiderTypes";

export const RIDER_EMPTY = "–";

export function formatRiderDate(iso: string | null | undefined): string {
  if (!iso) return RIDER_EMPTY;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const datePart = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timePart = d
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(/\s/g, "");
    return `${datePart} | ${timePart}`;
  } catch {
    return iso;
  }
}

export function getRiderStatus(rider: AdminRider): string {
  const raw = rider.rider_status ?? rider.status ?? "active";
  return String(raw).trim() || "active";
}

export function getRiderPhone(rider: AdminRider): string {
  return rider.phone_number?.trim() || rider.phone?.trim() || "";
}

export function getRiderAvatar(rider: AdminRider): string | null {
  const url = rider.avatar ?? rider.avatar_url ?? null;
  return typeof url === "string" && url.trim() ? url.trim() : null;
}

export function getRiderLocation(rider: AdminRider): string {
  if (rider.location?.trim()) return rider.location.trim();
  const city = rider.location_city?.trim();
  const state = rider.location_state?.trim();
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  if (state) return state;
  if (rider.address?.trim()) return rider.address.trim();
  return RIDER_EMPTY;
}

export function getCompletedRides(rider: AdminRider): number {
  const rides = rider.completed_rides ?? rider.total_orders;
  return typeof rides === "number" ? rides : Number(rides) || 0;
}

export function getRiderStatusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "active" || s === "approved" || s === "completed") return "badge-success";
  if (
    s === "busy" ||
    s === "pending" ||
    s === "onboarding" ||
    s === "in_review" ||
    s === "in review"
  ) {
    return "badge-warning";
  }
  if (s === "suspended" || s === "rejected" || s === "declined") return "badge-danger";
  return "badge-neutral";
}

export function formatRiderJoinedDate(iso: string | null | undefined): string {
  if (!iso) return RIDER_EMPTY;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return iso;
  }
}

export function getRiderJoinedDate(rider: AdminRider): string {
  return formatRiderJoinedDate(
    rider.date_joined ?? rider.joined_at ?? rider.created_at,
  );
}

export function getRiderRating(rider: AdminRider): string {
  const rating = rider.rating;
  if (rating == null || rating === "") return RIDER_EMPTY;
  const n = typeof rating === "number" ? rating : Number.parseFloat(String(rating));
  return Number.isFinite(n) ? n.toFixed(1) : String(rating);
}

export function getRiderActiveOrderNumber(rider: AdminRider): string | null {
  if (rider.current_order_number?.trim()) return rider.current_order_number.trim();
  if (rider.active_order_number?.trim()) return rider.active_order_number.trim();
  if (typeof rider.current_order === "string" && rider.current_order.trim()) {
    return rider.current_order.trim();
  }
  const order = rider.current_order ?? rider.active_order;
  if (order && typeof order === "object") {
    const num = order.order_number ?? order.number;
    if (num?.trim()) return num.trim();
  }
  return null;
}

export function riderHasActiveDelivery(rider: AdminRider): boolean {
  const status = getRiderStatus(rider).toLowerCase();
  return status === "busy" || !!getRiderActiveOrderNumber(rider);
}

export function formatRiderStatusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const VEHICLE_LABELS: Record<string, string> = {
  motorcycle: "Motorcycle",
  bicycle: "Bicycle",
  van: "Van",
};

export function getRiderVehicleLabel(rider: AdminRider): string {
  if (rider.vehicle_label?.trim()) return rider.vehicle_label.trim();
  const raw = rider.vehicle_type;
  if (!raw) return RIDER_EMPTY;
  const key = String(raw).trim().toLowerCase();
  return VEHICLE_LABELS[key] ?? formatRiderStatusLabel(key);
}

export function getOnboardingStatus(rider: AdminRider): string {
  if (rider.onboarding_status_label?.trim()) {
    return rider.onboarding_status_label.trim();
  }
  const raw = rider.onboarding_status;
  if (raw?.trim()) return formatRiderStatusLabel(raw);
  return RIDER_EMPTY;
}

export function getOnboardingStatusBadgeClass(rider: AdminRider): string {
  const raw = (rider.onboarding_status ?? rider.onboarding_status_label ?? "")
    .trim()
    .toLowerCase();
  return getRiderStatusBadgeClass(raw);
}

export function getRiderDateAddedLabel(rider: AdminRider): string {
  if (rider.date_added_label?.trim()) return rider.date_added_label.trim();
  return formatRiderDate(rider.date_added ?? rider.submitted_at ?? rider.created_at);
}

export function getRiderSubmittedDate(rider: AdminRider): string {
  return formatRiderJoinedDate(
    rider.date_added ?? rider.submitted_at ?? rider.created_at ?? rider.joined_at,
  );
}

export function getDocumentsUploadProgress(rider: AdminRider): string {
  if (rider.documents_uploaded?.label?.trim()) {
    return rider.documents_uploaded.label.trim();
  }
  const uploaded = rider.documents_uploaded?.uploaded;
  const required = rider.documents_uploaded?.required;
  if (typeof uploaded === "number" && typeof required === "number" && required > 0) {
    return `${uploaded}/${required}`;
  }
  const docs = getRiderApplicationDocuments(rider);
  const approved = docs.filter((d) => d.status?.toLowerCase() === "approved").length;
  return `${approved}/${docs.length}`;
}

export function formatDocumentStatusLabel(status: string): string {
  return formatRiderStatusLabel(status);
}

export function getDocumentStatusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "approved") return "badge-success";
  if (s === "pending" || s === "in_review") return "badge-warning";
  if (s === "rejected" || s === "declined") return "badge-danger";
  return "badge-neutral";
}

const DEFAULT_APPLICATION_DOCUMENTS: Array<{
  key: string;
  label: string;
}> = [
  { key: "national_id", label: "National ID" },
  { key: "guarantor_form", label: "Guarantor Form" },
];

export function getRiderApplicationDocuments(rider: AdminRider): Array<{
  key: string;
  label: string;
  status: RiderDocumentStatus;
  file_url: string | null;
}> {
  if (rider.documents?.length) {
    return rider.documents.map((doc, index) => ({
      key: String(doc.id ?? doc.type ?? doc.document_type ?? index),
      label:
        doc.label ??
        doc.name ??
        formatRiderStatusLabel(String(doc.type ?? doc.document_type ?? "Document")),
      status: (doc.status ?? "pending") as RiderDocumentStatus,
      file_url: doc.file_url?.trim() || null,
    }));
  }

  const statusMap = rider as AdminRider & Record<string, RiderDocumentStatus | undefined>;
  return DEFAULT_APPLICATION_DOCUMENTS.map((doc) => ({
    ...doc,
    status:
      (statusMap[`${doc.key}_status`] as RiderDocumentStatus | undefined) ??
      (statusMap[doc.key] as RiderDocumentStatus | undefined) ??
      "approved",
    file_url: null,
  }));
}

export function getInitialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "R";
}
