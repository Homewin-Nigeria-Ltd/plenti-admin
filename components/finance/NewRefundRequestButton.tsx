"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewRefundRequestModal } from "./NewRefundRequestModal";

export function NewRefundRequestButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        className="h-[44px] px-5 rounded-[4px] bg-[#0B1E66] text-white hover:bg-[#0B1E66]/90"
        onClick={() => setOpen(true)}>
        <Plus color="white" size={20} strokeWidth={3} /> New Refund Request
      </Button>
      <NewRefundRequestModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}

