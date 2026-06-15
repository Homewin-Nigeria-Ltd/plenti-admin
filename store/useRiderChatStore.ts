import api from "@/lib/api";
import {
  RIDER_CHAT_API,
  riderChatMessagesPath,
  riderChatOpenPath,
} from "@/data/riders";
import { useAccountStore } from "@/store/useAccountStore";
import type {
  RiderChatConversation,
  RiderChatConversationsResponse,
  RiderChatMessage,
  RiderChatMessagesResponse,
  RiderChatOpenResponse,
  RiderChatStaffMember,
  RiderChatStaffResponse,
  RiderChatState,
  RiderChatThreadConversation,
} from "@/types/RiderChatTypes";
import { create } from "zustand";

function upsertConversation(
  conversations: RiderChatConversation[],
  next: RiderChatConversation,
): RiderChatConversation[] {
  const index = conversations.findIndex(
    (c) => c.plenti_delivery_id === next.plenti_delivery_id,
  );
  if (index === -1) return [...conversations, next];
  const copy = [...conversations];
  copy[index] = { ...copy[index], ...next };
  return copy;
}

function upsertThreadConversation(
  thread: RiderChatThreadConversation,
  existing?: RiderChatConversation | null,
): RiderChatConversation {
  if (existing) {
    return {
      ...existing,
      order_id: thread.order_id,
      order_number: thread.order_number,
      rider: thread.rider,
      customer: thread.customer,
    };
  }

  return {
    conversation_id: thread.plenti_delivery_id,
    plenti_delivery_id: thread.plenti_delivery_id,
    order_id: thread.order_id,
    order_number: thread.order_number,
    rider: thread.rider,
    customer: thread.customer,
    last_message_preview: "–",
    last_message_at: "",
    unread_count: 0,
  };
}

async function ensureAccountLoaded(): Promise<void> {
  const accountState = useAccountStore.getState();
  if (accountState.account || accountState.loadingAccount) return;
  await accountState.fetchAccountSettings();
}

function isStaffMember(value: unknown): value is RiderChatStaffMember {
  return (
    typeof value === "object" &&
    value !== null &&
    "staff_role" in value &&
    "role_label" in value
  );
}

function getStaffFromResponse(data: RiderChatStaffResponse): RiderChatStaffMember[] {
  const raw = data.data;
  if (Array.isArray(raw)) return raw;
  if (!raw || !Array.isArray(raw.items) || raw.items.length === 0) return [];
  return isStaffMember(raw.items[0]) ? raw.items : [];
}

export const useRiderChatStore = create<RiderChatState>((set, get) => ({
  conversations: [],
  staff: [],
  threadByDeliveryId: {},
  messagesByDeliveryId: {},
  activeDeliveryId: null,
  loadingConversations: false,
  loadingStaff: false,
  loadingMessages: false,
  sendingMessage: false,
  conversationsError: null,
  staffError: null,
  messagesError: null,

  fetchStaff: async (params) => {
    const page = params?.page ?? 1;
    const search = params?.search?.trim() ?? "";
    set({ loadingStaff: true, staffError: null });
    try {
      const query: Record<string, string | number> = { page, per_page: 8 };
      if (search) query.search = search;

      const { data } = await api.get<RiderChatStaffResponse>(RIDER_CHAT_API.staff, {
        params: query,
      });
      set({ staff: getStaffFromResponse(data) });
      return true;
    } catch (error) {
      console.error("Error fetching rider chat staff =>", error);
      set({
        staffError: "Failed to load staff",
        staff: [],
      });
      return false;
    } finally {
      set({ loadingStaff: false });
    }
  },

  fetchConversations: async (params) => {
    const search = params?.search?.trim() ?? "";
    const per_page = params?.per_page ?? 20;
    set({ loadingConversations: true, conversationsError: null });
    try {
      const query: Record<string, string | number> = { per_page };
      if (search) query.search = search;

      const { data } = await api.get<RiderChatConversationsResponse>(
        RIDER_CHAT_API.conversations,
        { params: query },
      );
      set({ conversations: data.data?.items ?? [] });
      return true;
    } catch (error) {
      console.error("Error fetching rider chat conversations =>", error);
      set({
        conversationsError: "Failed to load conversations",
        conversations: [],
      });
      return false;
    } finally {
      set({ loadingConversations: false });
    }
  },

  fetchMessages: async (deliveryId) => {
    set({ loadingMessages: true, messagesError: null });
    try {
      await ensureAccountLoaded();
      const { data } = await api.get<RiderChatMessagesResponse>(
        riderChatMessagesPath(deliveryId),
      );
      const thread = data.data?.conversation ?? null;
      const messages = data.data?.messages?.data ?? [];

      set((state) => {
        const existing = state.conversations.find(
          (c) => c.plenti_delivery_id === deliveryId,
        );
        const conversations = thread
          ? upsertConversation(
              state.conversations,
              upsertThreadConversation(thread, existing),
            )
          : state.conversations;

        return {
          conversations,
          threadByDeliveryId: thread
            ? { ...state.threadByDeliveryId, [deliveryId]: thread }
            : state.threadByDeliveryId,
          messagesByDeliveryId: {
            ...state.messagesByDeliveryId,
            [deliveryId]: messages,
          },
        };
      });
      return true;
    } catch (error) {
      console.error("Error fetching rider chat messages =>", error);
      set({ messagesError: "Failed to load messages" });
      return false;
    } finally {
      set({ loadingMessages: false });
    }
  },

  openRiderChat: async (riderId) => {
    set({ loadingConversations: true, conversationsError: null });
    try {
      const { data } = await api.get<RiderChatOpenResponse>(riderChatOpenPath(riderId));
      const deliveryId = data.data?.plenti_delivery_id ?? null;
      const conversation = data.data?.conversation;

      if (deliveryId == null) {
        set({ conversationsError: "No active chat found for this rider" });
        return false;
      }

      set((state) => {
        const existing = state.conversations.find(
          (c) => c.plenti_delivery_id === deliveryId,
        );
        const conversations =
          conversation && "rider" in conversation
            ? upsertConversation(
                state.conversations,
                conversation as RiderChatConversation,
              )
            : conversation
              ? upsertConversation(
                  state.conversations,
                  upsertThreadConversation(
                    conversation as RiderChatThreadConversation,
                    existing,
                  ),
                )
              : state.conversations;

        return {
          conversations,
          activeDeliveryId: deliveryId,
        };
      });

      await get().fetchMessages(deliveryId);
      return true;
    } catch (error) {
      console.error("Error opening rider chat =>", error);
      set({ conversationsError: "Failed to open rider chat" });
      return false;
    } finally {
      set({ loadingConversations: false });
    }
  },

  sendMessage: async (deliveryId, message) => {
    const trimmed = message.trim();
    if (!trimmed) return false;

    set({ sendingMessage: true });
    try {
      const { data } = await api.post<RiderChatMessagesResponse>(
        riderChatMessagesPath(deliveryId),
        { message: trimmed },
      );

      const created = data.data?.messages?.data?.[0] ?? data.data;
      const optimistic: RiderChatMessage =
        created && typeof created === "object" && "message" in created
          ? (created as RiderChatMessage)
          : {
              id: Date.now(),
              sender_type: "admin",
              sender_id: useAccountStore.getState().account?.id ?? 0,
              sender_name: useAccountStore.getState().account?.name ?? "Admin",
              message_type: "text",
              message: trimmed,
              image_url: null,
              is_read: false,
              read_at: null,
              sent_at: new Date().toISOString(),
            };

      set((state) => {
        const existing = state.messagesByDeliveryId[deliveryId] ?? [];
        const conversations = state.conversations.map((conversation) =>
          conversation.plenti_delivery_id === deliveryId
            ? {
                ...conversation,
                last_message_preview: trimmed,
                last_message_at: optimistic.sent_at,
                unread_count: 0,
              }
            : conversation,
        );

        return {
          conversations,
          messagesByDeliveryId: {
            ...state.messagesByDeliveryId,
            [deliveryId]: [...existing, optimistic],
          },
        };
      });

      return true;
    } catch (error) {
      console.error("Error sending rider chat message =>", error);
      return false;
    } finally {
      set({ sendingMessage: false });
    }
  },

  setActiveDeliveryId: (deliveryId) => set({ activeDeliveryId: deliveryId }),

  clearChat: () =>
    set({
      conversations: [],
      staff: [],
      threadByDeliveryId: {},
      messagesByDeliveryId: {},
      activeDeliveryId: null,
      loadingConversations: false,
      loadingStaff: false,
      loadingMessages: false,
      sendingMessage: false,
      conversationsError: null,
      staffError: null,
      messagesError: null,
    }),
}));
