export const metadata = {
  title: "New Transfer | Stock Transfer | Plenti Admin",
};

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewStockTransferPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/inventory/stock-transfer">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <h2 className="text-xl font-semibold text-[#101928]">New Transfer</h2>
      </div>
      <div className="bg-white rounded-xl border border-[#EAECF0] p-8">
        <p className="text-[#667085] text-sm">New transfer form — coming soon.</p>
      </div>
    </div>
  );
}
