export const metadata = {
  title: "Marketing & Engagement",
};

import MarketingContent from "@/components/marketing/MarketingContent";

export default function MarketingPage() {
  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <MarketingContent />
    </div>
  );
}
