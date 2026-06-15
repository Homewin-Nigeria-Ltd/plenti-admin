export type RiderChatParticipant = {
  id: number;
  name: string;
  avatar?: string | null;
  last_seen_label?: string | null;
};

export type RiderChatConversation = {
  conversation_id: number;
  plenti_delivery_id: number;
  order_id: number;
  order_number: string;
  rider: RiderChatParticipant;
  customer: RiderChatParticipant;
  last_message_preview: string;
  last_message_at: string;
  unread_count: number;
};

export type RiderChatMessage = {
  id: number;
  sender_type: string;
  sender_id: number;
  sender_name: string;
  message_type: string;
  message: string;
  image_url: string | null;
  is_read: boolean;
  read_at: string | null;
  sent_at: string;
  is_outgoing?: boolean;
};

export type RiderChatThreadConversation = {
  plenti_delivery_id: number;
  order_id: number;
  order_number: string;
  rider: RiderChatParticipant;
  customer: RiderChatParticipant;
};

export type RiderChatMessagesResponse = {
  status: string;
  code?: number;
  message?: string;
  data?: {
    conversation?: RiderChatThreadConversation;
    messages?: {
      data?: RiderChatMessage[];
      current_page?: number;
      last_page?: number;
      per_page?: number;
      total?: number;
    };
    pagination?: {
      current_page?: number;
      per_page?: number;
      total?: number;
      last_page?: number;
    };
  };
  timestamp?: string;
};

export type RiderChatConversationsResponse = {
  status: string;
  code?: number;
  message?: string;
  data?: {
    items?: RiderChatConversation[];
    pagination?: {
      current_page?: number;
      per_page?: number;
      total?: number;
      last_page?: number;
    };
  };
  timestamp?: string;
};

export type RiderChatStaffMember = {
  id: number;
  user_id: number;
  name: string;
  full_name: string;
  email: string;
  initials: string;
  staff_role: string;
  role_label: string;
  presence_status: string;
  is_favorited: boolean;
  joined_at: string;
};

export type RiderChatStaffResponse = {
  success?: boolean;
  status?: string;
  code?: number;
  message?: string;
  data?:
    | RiderChatStaffMember[]
    | {
        items?: RiderChatStaffMember[];
      };
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type RiderChatOpenResponse = {
  status: string;
  code?: number;
  message?: string;
  data?: {
    plenti_delivery_id?: number;
    conversation?: RiderChatConversation | RiderChatThreadConversation;
  };
  timestamp?: string;
};

export type RiderChatState = {
  conversations: RiderChatConversation[];
  staff: RiderChatStaffMember[];
  threadByDeliveryId: Record<number, RiderChatThreadConversation>;
  messagesByDeliveryId: Record<number, RiderChatMessage[]>;
  activeDeliveryId: number | null;
  loadingConversations: boolean;
  loadingStaff: boolean;
  loadingMessages: boolean;
  sendingMessage: boolean;
  conversationsError: string | null;
  staffError: string | null;
  messagesError: string | null;
  fetchConversations: (params?: {
    search?: string;
    per_page?: number;
  }) => Promise<boolean>;
  fetchStaff: (params?: { page?: number; search?: string }) => Promise<boolean>;
  fetchMessages: (deliveryId: number) => Promise<boolean>;
  openRiderChat: (riderId: number) => Promise<boolean>;
  sendMessage: (deliveryId: number, message: string) => Promise<boolean>;
  setActiveDeliveryId: (deliveryId: number | null) => void;
  clearChat: () => void;
};
