import { Suspense } from "react";
import SalesContent from "@/components/sales/SalesContent";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Sales Management | Plenti Admin",
};

function SalesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 flex-1" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function SaleManagement() {
  return (
    <Suspense fallback={<SalesSkeleton />}>
      <SalesContent />
    </Suspense>
  );
}
