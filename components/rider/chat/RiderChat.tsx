"use client";

import { ConversationAvatar } from "@/components/rider/chat/ConversationAvatar";
import { StaffMemberAvatar } from "@/components/rider/chat/StaffMemberAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitialsFromName } from "@/lib/riderDisplay";
import {
  formatChatSentAt,
  getActiveChatThread,
  isAdminChatMessage,
} from "@/lib/riderChatDisplay";
import { cn } from "@/lib/utils";
import { useAccountStore } from "@/store/useAccountStore";
import { useRiderChatStore } from "@/store/useRiderChatStore";
import {
  CheckCheck,
  Loader2,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Smile,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";
import type { RiderChatStaffMember } from "@/types/RiderChatTypes";

export default function RiderChat() {
  const searchParams = useSearchParams();
  const riderIdParam = searchParams.get("riderId");

  const [search, setSearch] = React.useState("");
  const [debouncedSearch] = useDebounce(search, 400);
  const [draft, setDraft] = React.useState("");
  const hasAutoSelectedConversation = React.useRef(false);

  const fetchAccountSettings = useAccountStore((s) => s.fetchAccountSettings);
  const accountId = useAccountStore((s) => s.account?.id);

  const {
    conversations,
    staff,
    threadByDeliveryId,
    messagesByDeliveryId,
    activeDeliveryId,
    loadingConversations,
    loadingStaff,
    loadingMessages,
    sendingMessage,
    conversationsError,
    staffError,
    messagesError,
    fetchConversations,
    fetchStaff,
    fetchMessages,
    openRiderChat,
    sendMessage,
    setActiveDeliveryId,
  } = useRiderChatStore();

  React.useEffect(() => {
    void fetchAccountSettings();
  }, [fetchAccountSettings]);

  React.useEffect(() => {
    void fetchStaff({ search: debouncedSearch });
  }, [debouncedSearch, fetchStaff]);

  React.useEffect(() => {
    void fetchConversations({ search: debouncedSearch, per_page: 20 });
  }, [debouncedSearch, fetchConversations]);

  React.useEffect(() => {
    const riderId = Number(riderIdParam);
    if (!Number.isFinite(riderId) || riderId <= 0) return;
    void openRiderChat(riderId).then((ok) => {
      if (!ok) toast.error("Could not open chat for this rider");
    });
  }, [riderIdParam, openRiderChat]);

  React.useEffect(() => {
    if (hasAutoSelectedConversation.current || loadingConversations) return;
    if (riderIdParam) return;

    const first = conversations[0];
    if (!first || activeDeliveryId != null) return;

    hasAutoSelectedConversation.current = true;
    setActiveDeliveryId(first.plenti_delivery_id);
    void fetchMessages(first.plenti_delivery_id);
  }, [
    activeDeliveryId,
    conversations,
    fetchMessages,
    loadingConversations,
    riderIdParam,
    setActiveDeliveryId,
  ]);

  React.useEffect(() => {
    if (activeDeliveryId == null || accountId == null) return;
    if (messagesByDeliveryId[activeDeliveryId]) return;
    void fetchMessages(activeDeliveryId);
  }, [activeDeliveryId, accountId, fetchMessages, messagesByDeliveryId]);

  const activeConversation = React.useMemo(() => {
    if (activeDeliveryId == null) return conversations[0] ?? null;
    return (
      conversations.find((c) => c.plenti_delivery_id === activeDeliveryId) ??
      conversations[0] ??
      null
    );
  }, [activeDeliveryId, conversations]);

  const activeThread = React.useMemo(() => {
    if (activeDeliveryId == null) return null;
    return getActiveChatThread(activeDeliveryId, conversations, threadByDeliveryId);
  }, [activeDeliveryId, conversations, threadByDeliveryId]);

  const messages =
    activeDeliveryId != null ? (messagesByDeliveryId[activeDeliveryId] ?? []) : [];

  const messageContext = React.useMemo(
    () => ({
      adminUserId: accountId ?? null,
      riderId: activeThread?.rider.id ?? activeConversation?.rider.id ?? null,
      customerId: activeThread?.customer.id ?? activeConversation?.customer.id ?? null,
    }),
    [accountId, activeConversation, activeThread],
  );

  const handleSelectConversation = (deliveryId: number) => {
    setActiveDeliveryId(deliveryId);
  };

  const handleSend = async () => {
    if (activeDeliveryId == null || !draft.trim() || sendingMessage) return;
    const text = draft.trim();
    setDraft("");
    const ok = await sendMessage(activeDeliveryId, text);
    if (!ok) {
      setDraft(text);
      toast.error("Failed to send message");
    }
  };

  const headerRider = activeThread?.rider ?? activeConversation?.rider;

  return (
    <div className="bg-white rounded-xl border border-[#EAECF0] overflow-hidden flex flex-col h-[calc(100vh-180px)] min-h-[720px]">
      <div className="flex flex-1 min-h-0 h-full">
        <div className="w-full max-w-[340px] shrink-0 border-r border-[#EAECF0] flex flex-col min-h-0 h-full">
          <div className="p-4 border-b border-[#EAECF0]">
            <div className="border border-[#EAECF0] rounded-xl h-11 flex items-center gap-2 px-3 bg-white">
              <Search className="size-4 text-[#98A2B3] shrink-0" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="border-0 shadow-none h-9 p-0 focus-visible:ring-0 placeholder:text-[#98A2B3]"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            {(Array.isArray(staff) && staff.length > 0) || loadingStaff ? (
              <div className="border-b border-[#EAECF0]">
                <p className="px-4 pt-3 pb-2 text-xs font-semibold uppercase tracking-wide text-[#98A2B3]">
                  Staff
                </p>
                {loadingStaff && (!Array.isArray(staff) || staff.length === 0) ? (
                  <div className="px-4 pb-3 space-y-3">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Skeleton className="size-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-36" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : staffError ? (
                  <p className="px-4 pb-4 text-xs text-center text-[#667085]">{staffError}</p>
                ) : Array.isArray(staff) ? (
                  staff.map((member: RiderChatStaffMember) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 px-4 py-3 border-b border-[#F2F4F7] last:border-b-0"
                    >
                      <StaffMemberAvatar member={member} /* showPresence */ />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-sm text-[#101928] truncate">
                            {member.name}
                          </p>
                          {member.is_favorited ? (
                            <Star className="size-4 text-[#F59E0B] fill-[#F59E0B] shrink-0" />
                          ) : null}
                        </div>
                        <p className="text-xs text-[#667085] truncate">{member.role_label}</p>
                      </div>
                    </div>
                  ))
                ) : null}
              </div>
            ) : null}

            {loadingConversations ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Skeleton className="size-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : conversationsError ? (
              <p className="px-4 py-8 text-sm text-center text-[#667085]">
                {conversationsError}
              </p>
            ) : conversations.length === 0 ? (
              <p className="px-4 py-8 text-sm text-center text-[#667085]">
                {debouncedSearch.trim()
                  ? "No conversations found"
                  : "No conversations yet"}
              </p>
            ) : (
              conversations.map((conversation) => {
                const isActive =
                  conversation.plenti_delivery_id === activeDeliveryId;
                return (
                  <button
                    key={conversation.conversation_id}
                    type="button"
                    onClick={() =>
                      handleSelectConversation(conversation.plenti_delivery_id)
                    }
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-[#F2F4F7]",
                      isActive ? "bg-[#F2F4F7]" : "hover:bg-[#F9FAFB]",
                    )}
                  >
                    <ConversationAvatar
                      conversation={conversation}
                      // showOnlineDot={isActive}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-[#101928] truncate">
                          {conversation.rider.name}
                        </p>
                        <div className="flex items-center gap-1 shrink-0">
                          {conversation.unread_count === 0 ? (
                            <CheckCheck className="size-4 text-primary" />
                          ) : null}
                          <span className="text-xs text-[#98A2B3]">
                            {formatChatSentAt(conversation.last_message_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className="text-xs text-[#667085] truncate">
                          {conversation.last_message_preview}
                        </p>
                        {conversation.unread_count > 0 ? (
                          <span className="min-w-5 h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-semibold flex items-center justify-center shrink-0">
                            {conversation.unread_count}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {headerRider ? (
            <>
              <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#EAECF0] shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-11 shrink-0">
                    {headerRider.avatar ? (
                      <AvatarImage src={headerRider.avatar} alt={headerRider.name} />
                    ) : null}
                    <AvatarFallback className="bg-primary text-white text-sm font-semibold">
                      {getInitialsFromName(headerRider.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#101928] truncate">
                      {headerRider.name}
                    </p>
                    <p className="text-xs text-[#667085]">
                      {[
                        activeThread?.order_number || activeConversation?.order_number
                          ? `Order ${activeThread?.order_number ?? activeConversation?.order_number}`
                          : null,
                        activeThread?.customer.name ?? activeConversation?.customer.name,
                        headerRider.last_seen_label ?? "last seen recently",
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#667085]">
                  <button
                    type="button"
                    aria-label="Call"
                    className="size-10 rounded-full hover:bg-[#F2F4F7] flex items-center justify-center"
                  >
                    <Phone className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Search in conversation"
                    className="size-10 rounded-full hover:bg-[#F2F4F7] flex items-center justify-center"
                  >
                    <Search className="size-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="More options"
                    className="size-10 rounded-full hover:bg-[#F2F4F7] flex items-center justify-center"
                  >
                    <MoreVertical className="size-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-[#FCFCFD]">
                {loadingMessages ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <Loader2 className="size-8 animate-spin text-[#0B1E66]" />
                    <p className="text-sm text-[#667085]">Loading messages…</p>
                  </div>
                ) : messagesError ? (
                  <p className="text-sm text-center text-[#667085]">{messagesError}</p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-center text-[#667085]">
                    No messages yet. Start the conversation.
                  </p>
                ) : (
                  messages.map((message) => {
                    const outgoing = isAdminChatMessage(message, messageContext);
                    return outgoing ? (
                      <div key={message.id} className="flex justify-end">
                        <div className="max-w-[75%]">
                          <div className="bg-[#6F91F6] text-white rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed">
                            {message.message}
                          </div>
                          <div className="flex items-center justify-end gap-1.5 mt-1 pr-1">
                            <span className="text-[11px] text-[#98A2B3]">
                              {formatChatSentAt(message.sent_at)}
                            </span>
                            {message.is_read ? (
                              <CheckCheck className="size-4 text-primary" />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={message.id} className="flex items-end gap-2 max-w-[85%]">
                        <Avatar className="size-8 shrink-0">
                          {message.sender_type === "customer" ? null : headerRider.avatar ? (
                            <AvatarImage src={headerRider.avatar} alt={headerRider.name} />
                          ) : null}
                          <AvatarFallback
                            className={
                              message.sender_type === "customer"
                                ? "bg-[#E8EEFF] text-[#0B1E66] text-xs"
                                : "bg-primary text-white text-xs"
                            }
                          >
                            {message.sender_type === "customer"
                              ? getInitialsFromName(message.sender_name)
                              : getInitialsFromName(headerRider.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[11px] font-medium text-[#667085] mb-1 ml-1">
                            {message.sender_name}
                          </p>
                          <div className="bg-[#F2F4F7] text-[#101928] rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed">
                            {message.image_url ? (
                              <Image
                                src={message.image_url}
                                alt="Chat attachment"
                                width={320}
                                height={240}
                                unoptimized
                                className="max-w-full h-auto rounded-lg"
                              />
                            ) : (
                              message.message
                            )}
                          </div>
                          <p className="text-[11px] text-[#98A2B3] mt-1 ml-1">
                            {formatChatSentAt(message.sent_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="px-5 py-4 border-t border-[#EAECF0] shrink-0 bg-white">
                <form
                  className="flex items-center gap-3 border border-[#EAECF0] rounded-full px-4 py-2 bg-white"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleSend();
                  }}
                >
                  <button
                    type="button"
                    aria-label="Attach file"
                    className="text-[#667085] hover:text-primary shrink-0"
                  >
                    <Paperclip className="size-5" />
                  </button>
                  <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write a message..."
                    disabled={sendingMessage}
                    className="border-0 shadow-none h-9 flex-1 focus-visible:ring-0 placeholder:text-[#98A2B3] px-0"
                  />
                  <button
                    type="button"
                    aria-label="Emoji"
                    className="text-[#667085] hover:text-primary shrink-0"
                  >
                    <Smile className="size-5" />
                  </button>
                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!draft.trim() || sendingMessage}
                    className="text-[#667085] hover:text-primary shrink-0 disabled:opacity-50"
                  >
                    {sendingMessage ? (
                      <Loader2 className="size-5 animate-spin" />
                    ) : (
                      <Mic className="size-5" />
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-[#667085]">
              {loadingConversations
                ? "Loading conversations…"
                : "Select a conversation to start chatting"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
