export type NotificationApiEntry = {
  id: number;
  user_id?: number;
  type: string;
  module?: string;
  title: string;
  message: string;
  action_text?: string | null;
  display_time?: string | null;
  relative_time?: string | null;
  is_read?: boolean;
  read_at: string | null;
  is_important: boolean;
  action_url: string | null;
  icon: string | null;
  channel: string;
  delivered_at: string | null;
  opened_at: string | null;
  campaign_id: number | null;
  created_at: string;
  updated_at: string;
};

export type NotificationsPaginatedData = {
  current_page: number;
  data: NotificationApiEntry[];
  first_page_url: string | null;
  last_page: number;
  last_page_url: string | null;
  next_page_url: string | null;
  prev_page_url: string | null;
  links: {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }[];
  path: string;
  per_page: number;
  to: number;
  from: number;
  total: number;
};

export type NotificationsResponse = {
  status?: string;
  code?: number;
  message?: string;
  data?: {
    summary?: {
      total?: number;
      unread?: number;
      read?: number;
    };
    tabs?: {
      all?: number;
      unread?: number;
    };
    notifications?: NotificationsPaginatedData;
    // backward compatibility for flatter payloads
    current_page?: number;
    data?: NotificationApiEntry[];
    first_page_url?: string | null;
    last_page?: number;
    last_page_url?: string | null;
    next_page_url?: string | null;
    prev_page_url?: string | null;
    links?: {
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }[];
    path?: string;
    per_page?: number;
    to?: number;
    from?: number;
    total?: number;
  };
  timestamp?: string;
};

export type NotificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export interface NotificationStatsResponse {
  status: string;
  code: number;
  message: string;
  data: NotificationData;
  timestamp: string;
}

export interface NotificationData {
  summary: {
    total_sent: { value: number; comparison: number };
    delivery_rate: { value: number; comparison: number };
    open_rate: { value: number; comparison: number };
    click_rate: { value: number; comparison: number };
  };
  channel_breakdown: {
    channel: "Email" | "In-App" | "SMS";
    sent_count: number;
    delivery_rate: number;
    open_rate: number;
  }[];
  total_notifications: number;
}

export interface NotificationByType {
  admin: number;
  inventory: number;
  stock_transfer: number;
  order: number;
  // If you expect other types in the future, you can add:
  // [key: string]: number;
}

export interface ChannelDelivery {
  channel: string;
  total: number;
  delivered: number;
  opened: number;
  delivery_rate: number;
  open_rate: number;
}

export interface CreateTemplateRequest {
  name: string;
  type: TemplateTypes;
  channel: TemplateChannels;
  title: string;
  message: string;
  is_active?: boolean;
}

export type TemplateChannels = "in_app" | "sms" | "email" | "push";

export type TemplateTypes =
  | "promotional"
  | "transactional"
  | "alert"
  | "system";

export interface NotificationTemplate extends Required<CreateTemplateRequest> {
  id: number;
  key: string;
  variables: string[];
  variable_definitions: Record<string, any> | null;
  usage_count: number;
  last_used_at: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type CreateCampaignPayload = {
  name: string;
  subject: string;
  message: string;
  channel: "push" | "email" | "sms";
  target_audience: "all" | "active" | "inactive" | "new" | "riders";
  notification_template_id: number;
  custom_filters?: Record<string, any>;
  scheduled_at?: string; // ISO date string if scheduled later
};

export interface Campaign extends Required<CreateCampaignPayload> {
  id: number;
  status: string;
  delivered_count: number;
  template: NotificationTemplate;
  delivery_rate: number;
  opened_count: number;
  open_rate: number;
  clicked_count: number;
  click_rate: number;
  failed_count: number;
  failure_rate: number;
}

export type SendNotificationPayload = {
  channel: string;
  recipient: string;
  title: string;
  message: string;
};
