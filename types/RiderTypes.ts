export type RiderStatus = "active" | "busy" | "suspended" | (string & {});

export type RiderRole = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_system?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type RiderActiveOrder = {
  id?: number;
  order_number?: string | null;
  number?: string | null;
};

export type RiderDocumentStatus =
  | "approved"
  | "pending"
  | "rejected"
  | (string & {});

export type RiderDocument = {
  id?: number;
  name?: string;
  label?: string;
  type?: string;
  document_type?: string;
  status?: RiderDocumentStatus;
};

export type RiderVehicleType = "motorcycle" | "bicycle" | "van" | (string & {});

export type AdminRider = {
  id: number;
  name: string;
  phone: string;
  email: string;
  avatar_url: string | null;
  avatar?: string | null;
  permissions_list?: string[];
  roles?: RiderRole[];
  vehicle_type?: RiderVehicleType | string | null;
  submitted_at?: string | null;
  documents?: RiderDocument[] | null;
  documents_uploaded?: number | null;
  documents_total?: number | null;
  total_orders?: number;
  completed_rides?: number;
  amount_spent?: number | string;
  location?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  status?: string | null;
  rider_status?: string | null;
  created_at?: string | null;
  joined_at?: string | null;
  date_joined?: string | null;
  rating?: number | string | null;
  current_order_number?: string | null;
  current_order_id?: number | null;
  active_order_number?: string | null;
  active_order_id?: number | null;
  current_order?: string | RiderActiveOrder | null;
  active_order?: RiderActiveOrder | null;
};

export type CreateRiderPayload = {
  name: string;
  phone: string;
  email: string;
  vehicle_type?: RiderVehicleType;
};

export type CreateRiderResponse = {
  status: string;
  code?: number;
  message?: string;
  data?: AdminRider;
  errors?: Record<string, string[]>;
  timestamp?: string;
};

export type RiderDetailResponse = {
  status: string;
  code?: number;
  message?: string;
  data: AdminRider;
  timestamp?: string;
};

export type RidersListResponse = {
  status: string;
  code?: number;
  message?: string;
  data:
    | AdminRider[]
    | {
        current_page?: number;
        data?: AdminRider[];
        last_page?: number;
        per_page?: number;
        total?: number;
      };
  meta?: {
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
  };
  timestamp?: string;
};

export type RiderListSlice = {
  riders: AdminRider[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalItems: number;
  lastQuery: { page: number; search: string };
};

export type RiderState = RiderListSlice & {
  onboarding: RiderListSlice;
  singleRider: AdminRider | null;
  loadingSingle: boolean;
  suspending: boolean;
  fetchRiders: (params?: { page?: number; search?: string }) => Promise<boolean>;
  fetchOnboardingRiders: (params?: { page?: number; search?: string }) => Promise<boolean>;
  fetchSingleRider: (id: number, preview?: AdminRider | null) => Promise<boolean>;
  suspendRider: (id: number) => Promise<boolean>;
  clearSingleRider: () => void;
  creatingRider: boolean;
  createRider: (payload: CreateRiderPayload) => Promise<{
    ok: boolean;
    message?: string;
    errors?: Record<string, string[]>;
  }>;
  reviewingApplication: boolean;
  approveOnboardingRider: (id: number) => Promise<boolean>;
  rejectOnboardingRider: (id: number, reason: string) => Promise<boolean>;
};
