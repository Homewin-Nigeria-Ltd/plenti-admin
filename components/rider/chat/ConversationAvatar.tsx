"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { RiderConversation } from "@/lib/riderChatMock";

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
  online = true,
  className,
}: {
  children: React.ReactNode;
  online?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative shrink-0", className)}>
      {children}
      <OnlineStatusDot online={online} />
    </div>
  );
}

export function ConversationAvatar({
  conversation,
  showOnlineDot = false,
}: {
  conversation: RiderConversation;
  showOnlineDot?: boolean;
}) {
  const online = showOnlineDot && conversation.online !== false;

  if (conversation.isGroup) {
    return (
      <AvatarWithOnlineStatus online={online} className="size-12">
        <div className="relative size-12">
          <Avatar className="size-9 absolute top-0 left-0 border-2 border-white">
            <AvatarFallback className="bg-violet-500 text-white text-xs">D</AvatarFallback>
          </Avatar>
          <Avatar className="size-9 absolute bottom-0 right-0 border-2 border-white">
            <AvatarFallback className="bg-sky-500 text-white text-xs">+</AvatarFallback>
          </Avatar>
        </div>
      </AvatarWithOnlineStatus>
    );
  }

  return (
    <AvatarWithOnlineStatus online={online}>
      <Avatar className="size-12">
        {conversation.avatarUrl ? (
          <AvatarImage src={conversation.avatarUrl} alt={conversation.name} />
        ) : null}
        <AvatarFallback
          className="text-white text-sm font-semibold"
          style={{ backgroundColor: conversation.avatarColor ?? "#0B1E66" }}
        >
          {conversation.initials ?? conversation.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </AvatarWithOnlineStatus>
  );
}
