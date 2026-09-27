"use client";

import { chatMediaUrl } from "@/lib/riderChatDisplay";
import type { RiderChatMessage } from "@/types/RiderChatTypes";
import { FileText } from "lucide-react";
import Image from "next/image";

export function ChatMessageBody({
  message,
  outgoing,
}: {
  message: RiderChatMessage;
  outgoing?: boolean;
}) {
  const type = message.message_type?.toLowerCase() ?? "text";
  const mediaUrl = chatMediaUrl(message);
  const caption = message.message?.trim();
  const filename = message.media_filename?.trim();
  const textClass = outgoing ? "text-white" : "text-[#101928]";

  if ((type === "image" || message.media_mime?.startsWith("image/")) && mediaUrl) {
    return (
      <div className="space-y-2">
        <Image
          src={mediaUrl}
          alt={filename || caption || "Chat image"}
          width={320}
          height={240}
          unoptimized
          className="max-w-full h-auto rounded-lg"
        />
        {caption ? <p>{caption}</p> : null}
      </div>
    );
  }

  if ((type === "voice" || type === "audio") && mediaUrl) {
    return (
      <div className="space-y-2 min-w-[180px]">
        <audio controls src={mediaUrl} className="w-full max-w-[240px]" />
        {caption ? <p>{caption}</p> : null}
      </div>
    );
  }

  if ((type === "pdf" || type === "file") && mediaUrl) {
    return (
      <a
        href={mediaUrl}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center gap-2 underline break-all ${textClass}`}
      >
        <FileText className="size-4 shrink-0" />
        {filename || caption || "Open attachment"}
      </a>
    );
  }

  return <span>{caption || "—"}</span>;
}
