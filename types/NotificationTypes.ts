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
  links: { url: string | null; label: string; page: number | null; active: boolean }[];
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
    links?: { url: string | null; label: string; page: number | null; active: boolean }[];
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
