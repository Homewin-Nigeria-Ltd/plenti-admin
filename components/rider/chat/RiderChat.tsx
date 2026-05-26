"use client";

import { ConversationAvatar } from "@/components/rider/chat/ConversationAvatar";
import {
  RIDER_CHAT_CONVERSATIONS,
  RIDER_CHAT_MESSAGES,
} from "@/lib/riderChatMock";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  CheckCheck,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Pin,
  Search,
  Smile,
} from "lucide-react";
import * as React from "react";

export default function RiderChat() {
  const [search, setSearch] = React.useState("");
  const [activeId, setActiveId] = React.useState(RIDER_CHAT_CONVERSATIONS[0]?.id ?? "");
  const [draft, setDraft] = React.useState("");

  const conversations = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return RIDER_CHAT_CONVERSATIONS;
    return RIDER_CHAT_CONVERSATIONS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q),
    );
  }, [search]);

  const active = React.useMemo(
    () => RIDER_CHAT_CONVERSATIONS.find((c) => c.id === activeId) ?? conversations[0],
    [activeId, conversations],
  );

  const messages = active ? (RIDER_CHAT_MESSAGES[active.id] ?? []) : [];

  return (
    <div className="bg-white rounded-xl border border-[#EAECF0] overflow-hidden flex flex-col h-[calc(100vh-180px)] min-h-[720px]">
      <div className="flex flex-1 min-h-0 h-full">
        {/* Conversation list */}
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
            {conversations.map((conversation) => {
              const isActive = conversation.id === active?.id;
              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setActiveId(conversation.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-[#F2F4F7]",
                    isActive ? "bg-[#F2F4F7]" : "hover:bg-[#F9FAFB]",
                  )}
                >
                  <ConversationAvatar
                    conversation={conversation}
                    showOnlineDot={isActive}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm text-[#101928] truncate">
                        {conversation.name}
                      </p>
                      <div className="flex items-center gap-1 shrink-0">
                        {conversation.read && !conversation.unread ? (
                          <CheckCheck className="size-4 text-primary" />
                        ) : null}
                        <span className="text-xs text-[#98A2B3]">{conversation.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className="text-xs text-[#667085] truncate">{conversation.preview}</p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {conversation.pinned ? (
                          <Pin className="size-3.5 text-[#98A2B3] fill-[#98A2B3]" />
                        ) : null}
                        {conversation.unread ? (
                          <span className="min-w-5 h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-semibold flex items-center justify-center">
                            {conversation.unread}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active chat */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {active ? (
            <>
              <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[#EAECF0] shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-11 shrink-0">
                    {active.avatarUrl ? (
                      <AvatarImage src={active.avatarUrl} alt={active.name} />
                    ) : null}
                    <AvatarFallback
                      className="bg-primary text-white text-sm font-semibold"
                      style={
                        active.avatarColor
                          ? { backgroundColor: active.avatarColor }
                          : undefined
                      }
                    >
                      {active.initials ?? active.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#101928] truncate">{active.name}</p>
                    <p className="text-xs text-[#667085]">
                      {active.lastSeen ?? "last seen recently"}
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
                {messages.map((message) =>
                  message.outgoing ? (
                    <div key={message.id} className="flex justify-end">
                      <div className="max-w-[75%]">
                        <div className="bg-[#6F91F6] text-white rounded-2xl rounded-br-md px-4 py-3 text-sm leading-relaxed">
                          {message.text}
                        </div>
                        <div className="flex items-center justify-end gap-1.5 mt-1 pr-1">
                          <span className="text-[11px] text-[#98A2B3]">{message.time}</span>
                          {message.read ? (
                            <CheckCheck className="size-4 text-primary" />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={message.id} className="flex items-end gap-2 max-w-[85%]">
                      <Avatar className="size-8 shrink-0">
                        {active.avatarUrl ? (
                          <AvatarImage src={active.avatarUrl} alt={active.name} />
                        ) : null}
                        <AvatarFallback className="bg-primary text-white text-xs">
                          {active.initials ?? active.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="bg-[#F2F4F7] text-[#101928] rounded-2xl rounded-bl-md px-4 py-3 text-sm leading-relaxed">
                          {message.text}
                        </div>
                        <p className="text-[11px] text-[#98A2B3] mt-1 ml-1">{message.time}</p>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <div className="px-5 py-4 border-t border-[#EAECF0] shrink-0 bg-white">
                <div className="flex items-center gap-3 border border-[#EAECF0] rounded-full px-4 py-2 bg-white">
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
                    type="button"
                    aria-label="Voice message"
                    className="text-[#667085] hover:text-primary shrink-0"
                  >
                    <Mic className="size-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-sm text-[#667085]">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
