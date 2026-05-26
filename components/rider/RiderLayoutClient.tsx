"use client";

import dynamic from "next/dynamic";
import { RiderTabNav } from "@/components/rider/RiderTabNav";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import * as React from "react";

const OnboardRiderModal = dynamic(
  () => import("./OnboardRiderModal").then((mod) => mod.OnboardRiderModal),
  { ssr: false },
);

export function RiderLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [onboardOpen, setOnboardOpen] = React.useState(false);
  const isChatPage = pathname === "/rider/chat" || pathname.startsWith("/rider/chat/");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <RiderTabNav />
        {!isChatPage && (
          <Button
            onClick={() => setOnboardOpen(true)}
            className="btn btn-primary w-full sm:w-auto shrink-0"
          >
            <Plus className="size-4 mr-2" />
            Onboard Rider
          </Button>
        )}
      </div>

      {children}

      <OnboardRiderModal
        isOpen={onboardOpen}
        onClose={() => setOnboardOpen(false)}
        onSuccess={() => {
          setOnboardOpen(false);
          router.push("/rider/onboarding");
        }}
      />
    </div>
  );
}
