/** Body for PUT {{base_url}}/api/admin/account-settings/profile */
export type UpdateProfileRequest = {
  name: string;
  avatar_url?: string | null;
};

/** Body for PUT {{base_url}}/api/admin/account-settings/password */
export type UpdatePasswordRequest = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};

/** Logged-in admin account from GET {{base_url}}/api/admin/account-settings */
export type AccountSettingsUser = {
  id: number;
  social_id: string | null;
  social_type: string | null;
  name: string;
  email: string;
  role: string;
  department: string | null;
  position: string | null;
  created_by: number | null;
  status: string;
  is_verified: boolean;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
  points: number;
  trust_score: number;
  is_admin: boolean;
  account_locked: number;
  enabled: number;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  otp_expires_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  amount_spent: number;
  total_orders: number;
  roles: string[];
};

export type AdminUserStatus = "active" | "pending" | "inactive" | (string & {});

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string | null;
  is_admin: boolean;
  status: AdminUserStatus;
  is_verified: boolean;
  avatar_url: string | null;
  department: string | null;
  position: string | null;
  created_by_name: string | null;
  total_orders: number;
  amount_spent: string;
  joined_date: string;
  last_updated: string;
};

export type UserStats = {
  total_revenue: string;
  total_orders: number;
  refunds: number;
  net_profit: string;
};

export type AdminUsersResponse = {
  status: string;
  data: AdminUser[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
};

export type AdminSingleUserResponse = {
  status: string;
  data: AdminUser;
  stats: UserStats;
};

export type AdminDetailsResponse = {
  status: string;
  data: AdminUser;
};

export type CreateUserRequest = {
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  position: string;
  phone: string;
  role: "admin" | "customer";
  password: string;
};

export type CreateUserResponse = {
  status: string;
  message: string;
  data: AdminUser;
  generated_password?: string;
};

export type ApiValidationError = {
  message: string;
  errors: Record<string, string[]>;
};

export type CreateUserResult =
  | { ok: true; data: CreateUserResponse }
  | { ok: false; message: string; errors?: Record<string, string[]> };

export type UserState = {
  users: AdminUser[];
  loadingUsers: boolean;
  loadingSingleUser: boolean;
  creatingUser: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalItems: number;
  lastQuery: { page: number; search: string; role: "admin" | "customer" };
  singleUser: AdminUser | null;
  singleUserStats: UserStats | null;
  adminDetails: AdminUser | null;
  loadingAdminDetails: boolean;
  adminDetailsError: string | null;

  fetchUsers: (params?: {
    page?: number;
    search?: string;
    role?: "admin" | "customer";
  }) => Promise<boolean>;

  fetchSingleUser: (id: number) => Promise<boolean>;
  fetchAdminDetails: (id: number) => Promise<boolean>;
  clearSingleUser: () => void;

  createUser: (payload: CreateUserRequest) => Promise<CreateUserResult>;
};
