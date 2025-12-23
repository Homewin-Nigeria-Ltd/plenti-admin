export const metadata = {
  title: "Product Management | Plenti Admin",
};

import ProductCatalog from "@/components/product/ProductCatalog";

export default function ProductPage() {
  return (
    <div className="space-y-6">
      <ProductCatalog />
    </div>
  );
}
