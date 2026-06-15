"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialsFromName } from "@/lib/riderDisplay";
import { cn } from "@/lib/utils";
import type { RiderChatConversation } from "@/types/RiderChatTypes";

function OnlineStatusDot({ online = true }: { online?: boolean }) {
  if (!online) return null;
  return (
    <span
      className="absolute bottom-0 right-0 size-3 rounded-full bg-[#417FC6] border-2 border-white z-10"
      aria-hidden
    />
  );
}

function AvatarWithOnlineStatus({
  children,
  online: _online = true,
  className,
}: {
  children: React.ReactNode;
  online?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative shrink-0", className)}>
      {children}
      {/* <OnlineStatusDot online={online} /> */}
    </div>
  );
}

export function ConversationAvatar({
  conversation,
  showOnlineDot = false,
}: {
  conversation: RiderChatConversation;
  showOnlineDot?: boolean;
}) {
  const name = conversation.rider.name;
  const avatarUrl = conversation.rider.avatar ?? null;

  return (
    <AvatarWithOnlineStatus online={showOnlineDot}>
      <Avatar className="size-12">
        {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
        <AvatarFallback className="bg-primary text-white text-sm font-semibold">
          {getInitialsFromName(name)}
        </AvatarFallback>
      </Avatar>
    </AvatarWithOnlineStatus>
  );
}
