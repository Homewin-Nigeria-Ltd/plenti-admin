"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { RiderChatStaffMember } from "@/types/RiderChatTypes";

export function StaffMemberAvatar({
  member,
  showPresence: _showPresence = false,
}: {
  member: RiderChatStaffMember;
  showPresence?: boolean;
}) {
  // const isActive = member.presence_status?.toLowerCase() === "active";

  return (
    <div className="relative shrink-0">
      <Avatar className="size-12">
        <AvatarFallback className="bg-[#E8EEFF] text-[#0B1E66] text-sm font-semibold">
          {member.initials || member.name.slice(0, 1).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {/* {showPresence && isActive ? (
        <span
          className={cn(
            "absolute bottom-0 right-0 size-3 rounded-full border-2 border-white",
            "bg-[#417FC6]",
          )}
          aria-hidden
        />
      ) : null} */}
    </div>
  );
}
