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
  file_url?: string | null;
};

export type RiderApplication = {
  phone?: string;
  email?: string;
  vehicle_type?: string;
  submitted_at?: string;
  onboarding_status?: string;
  rejection_reason?: string | null;
};

export type RiderVehicleType = "motorcycle" | "bicycle" | "van" | (string & {});

export type RiderDocumentsUploaded = {
  uploaded?: number;
  required?: number;
  label?: string;
};

export type AdminRider = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  phone_number?: string;
  avatar?: string | null;
  avatar_url?: string | null;
  permissions_list?: string[];
  roles?: RiderRole[];
  vehicle_type?: RiderVehicleType | string | null;
  vehicle_label?: string | null;
  date_added?: string | null;
  date_added_label?: string | null;
  date_joined?: string | null;
  order_completed_at?: string | null;
  onboarding_status?: string | null;
  onboarding_status_label?: string | null;
  rider_status?: string | null;
  rider_status_label?: string | null;
  documents?: RiderDocument[] | null;
  documents_uploaded?: RiderDocumentsUploaded | null;
  completed_rides?: number;
  total_orders?: number;
  amount_spent?: number | string;
  location?: string | null;
  location_city?: string | null;
  location_state?: string | null;
  address?: string | null;
  status?: string | null;
  created_at?: string | null;
  joined_at?: string | null;
  submitted_at?: string | null;
  rating?: number | string | null;
  current_order_number?: string | null;
  current_order_id?: number | null;
  active_order_number?: string | null;
  active_order_id?: number | null;
  current_order?: string | RiderActiveOrder | null;
  active_order?: RiderActiveOrder | null;
};

export type RiderApplicationReviewData = {
  rider: AdminRider;
  application?: RiderApplication | null;
  documents?: RiderDocument[] | null;
};

export type RiderCurrentDelivery = {
  plenti_delivery_id: number;
  order_id: number;
  order_number: string;
  status: string;
};

export type RiderDetailData = {
  rider: AdminRider;
  current_delivery?: RiderCurrentDelivery | null;
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
  data: RiderDetailData;
  timestamp?: string;
};

export type RiderApplicationReviewResponse = {
  status: string;
  code?: number;
  message?: string;
  data: RiderApplicationReviewData;
  timestamp?: string;
};

export type RidersListResponse = {
  status: string;
  code?: number;
  message?: string;
  data?: {
    items?: AdminRider[];
    pagination?: {
      current_page?: number;
      last_page?: number;
      per_page?: number;
      total?: number;
    };
  };
  timestamp?: string;
};

export type OnboardingListResponse = {
  status: string;
  code?: number;
  message?: string;
  data?: {
    items?: AdminRider[];
    pagination?: {
      current_page?: number;
      last_page?: number;
      per_page?: number;
      total?: number;
    };
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
  lastQuery: { page: number; search: string; rider_status?: string };
};

export type RiderState = RiderListSlice & {
  onboarding: RiderListSlice;
  singleRider: AdminRider | null;
  currentDelivery: RiderCurrentDelivery | null;
  applicationReview: RiderApplicationReviewData | null;
  loadingSingle: boolean;
  suspending: boolean;
  fetchRiders: (params?: {
    page?: number;
    search?: string;
    rider_status?: string;
  }) => Promise<boolean>;
  fetchOnboardingRiders: (params?: { page?: number; search?: string }) => Promise<boolean>;
  fetchRiderDetail: (id: number) => Promise<boolean>;
  fetchApplicationReview: (id: number) => Promise<boolean>;
  suspendRider: (id: number) => Promise<boolean>;
  unsuspendRider: (id: number) => Promise<boolean>;
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
