"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";

const CHAT_EMOJIS = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😊",
  "😍",
  "😘",
  "😎",
  "🤔",
  "😅",
  "😉",
  "😢",
  "😭",
  "😡",
  "👍",
  "👎",
  "🙏",
  "👏",
  "🔥",
  "❤️",
  "💯",
  "✅",
  "🎉",
  "📦",
  "🚚",
  "📍",
] as const;

type ChatEmojiPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  onSelect: (emoji: string) => void;
};

export function ChatEmojiPicker({
  open,
  onOpenChange,
  disabled,
  onSelect,
}: ChatEmojiPickerProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Emoji"
          disabled={disabled}
          className="text-[#667085] hover:text-primary shrink-0 disabled:opacity-50"
        >
          <Smile className="size-5" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        className="w-64 p-2"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="grid grid-cols-7 gap-1">
          {CHAT_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="size-8 rounded-md text-lg leading-none hover:bg-[#F2F4F7]"
              onClick={() => onSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
