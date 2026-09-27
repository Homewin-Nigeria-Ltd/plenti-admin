import RiderChat from "@/components/rider/chat/RiderChat";
import { Suspense } from "react";

export default function RiderChatPage() {
  return (
    <Suspense fallback={<div className="h-[calc(100dvh-14.5rem)] rounded-xl bg-white border border-[#EAECF0]" />}>
      <RiderChat />
    </Suspense>
  );
}
