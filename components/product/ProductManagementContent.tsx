"use client";

import CategoryContent from "@/components/product/CategoryContent";
import ProductCatalog from "@/components/product/ProductCatalog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as React from "react";

export default function ProductManagementContent() {
  const [activeTab, setActiveTab] = React.useState("products");

  return (
    <div className="min-w-0 space-y-4 sm:space-y-5">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-w-0">
        <TabsList className="h-auto max-w-full justify-start gap-1 overflow-x-auto bg-transparent p-0">
          <TabsTrigger
            value="products"
            className="shrink-0 rounded-lg px-3 py-1.5 text-[13px] text-[#667085] data-[state=active]:bg-[#F2F4F7] data-[state=active]:text-[#101828] data-[state=active]:shadow-none"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            value="parent-category"
            className="shrink-0 rounded-lg px-3 py-1.5 text-[13px] text-[#667085] data-[state=active]:bg-[#F2F4F7] data-[state=active]:text-[#101828] data-[state=active]:shadow-none"
          >
            Parent Categories
          </TabsTrigger>
          <TabsTrigger
            value="sub-category"
            className="shrink-0 rounded-lg px-3 py-1.5 text-[13px] text-[#667085] data-[state=active]:bg-[#F2F4F7] data-[state=active]:text-[#101828] data-[state=active]:shadow-none"
          >
            Sub Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-3">
          <ProductCatalog />
        </TabsContent>
        <TabsContent value="parent-category" className="mt-3">
          <CategoryContent kind="parent" />
        </TabsContent>
        <TabsContent value="sub-category" className="mt-3">
          <CategoryContent kind="sub" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
