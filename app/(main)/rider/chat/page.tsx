import RiderChat from "@/components/rider/chat/RiderChat";
import { Suspense } from "react";

export default function RiderChatPage() {
  return (
    <Suspense fallback={<div className="min-h-[720px] rounded-xl bg-white border border-[#EAECF0]" />}>
      <RiderChat />
    </Suspense>
  );
}
