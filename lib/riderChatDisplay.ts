import type { RiderChatMessage, RiderChatThreadConversation } from "@/types/RiderChatTypes";

export function formatChatSentAt(iso: string | null | undefined): string {
  if (!iso) return "–";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const now = new Date();
    const sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    if (sameDay) {
      return d
        .toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
        .replace(/\s/g, "");
    }
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) {
      return d.toLocaleDateString("en-US", { weekday: "short" });
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

type AdminMessageContext = {
  adminUserId?: number | null;
  riderId?: number | null;
  customerId?: number | null;
};

export function isAdminChatMessage(
  message: RiderChatMessage,
  context?: AdminMessageContext,
): boolean {
  const senderType = message.sender_type?.toLowerCase() ?? "";
  if (senderType === "admin" || senderType === "support" || senderType === "system") {
    return true;
  }
  if (context?.adminUserId != null && message.sender_id === context.adminUserId) {
    return true;
  }
  if (senderType === "customer") return false;
  if (context?.customerId != null && message.sender_id === context.customerId) return false;
  if (senderType === "rider") return false;
  if (context?.riderId != null && message.sender_id === context.riderId) return false;
  return true;
}

export function getActiveChatThread(
  deliveryId: number,
  conversations: { plenti_delivery_id: number }[],
  threadByDeliveryId: Record<number, RiderChatThreadConversation>,
): RiderChatThreadConversation | null {
  return (
    threadByDeliveryId[deliveryId] ??
    (conversations.find((c) => c.plenti_delivery_id === deliveryId) as
      | RiderChatThreadConversation
      | undefined) ??
    null
  );
}
