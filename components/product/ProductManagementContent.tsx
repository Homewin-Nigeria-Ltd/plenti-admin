"use client";

import CategoryContent from "@/components/product/CategoryContent";
import ProductCatalog from "@/components/product/ProductCatalog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as React from "react";

export default function ProductManagementContent() {
  const [activeTab, setActiveTab] = React.useState("products");

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-w-0">
        <TabsList className="bg-transparent p-0 h-auto gap-2 overflow-x-auto justify-start max-w-full">
          <TabsTrigger
            value="products"
            className="data-[state=active]:bg-[#E8EEFF] data-[state=active]:text-[#0B1E66] data-[state=active]:shadow-sm px-4 py-2 text-[#808080] shrink-0"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-[#E8EEFF] data-[state=active]:text-[#0B1E66] data-[state=active]:shadow-sm px-4 py-2 text-[#808080] shrink-0"
          >
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-4 sm:mt-6">
          <ProductCatalog />
        </TabsContent>
        <TabsContent value="categories" className="mt-4 sm:mt-6">
          <CategoryContent />
        </TabsContent>
      </Tabs>
    </div>
  );
}
