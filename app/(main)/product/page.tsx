export const metadata = {
  title: "Product Management | Plenti Admin",
};

import ProductManagementContent from "@/components/product/ProductManagementContent";

export default function ProductPage() {
  return (
    <div className="min-w-0 space-y-6">
      <ProductManagementContent />
    </div>
  );
}
