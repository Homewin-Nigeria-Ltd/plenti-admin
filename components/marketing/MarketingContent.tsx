"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateBannerModal } from "./CreateBannerModal";
import { CreateFaqModal } from "./CreateFaqModal";
import { CreatePromoCodeModal } from "./CreatePromoCodeModal";
import BannersContent from "./BannersContent";
import FaqContent from "./FaqContent";
import PromoCodeContent from "./PromoCodeContent";

export default function MarketingContent() {
  const [activeTab, setActiveTab] = React.useState("banners");
  const [isCreateBannerModalOpen, setIsCreateBannerModalOpen] =
    React.useState(false);
  const [isCreatePromoCodeModalOpen, setIsCreatePromoCodeModalOpen] =
    React.useState(false);
  const [isCreateFaqModalOpen, setIsCreateFaqModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="mb-6 bg-transparent p-0 h-auto gap-2">
            <TabsTrigger
              value="banners"
              className="data-[state=active]:bg-[#E8EEFF] data-[state=active]:text-[#0B1E66] data-[state=active]:shadow-sm px-4 py-2 text-[#808080]"
            >
              Banners
            </TabsTrigger>
            <TabsTrigger
              value="promo-code"
              className="data-[state=active]:bg-[#E8EEFF] data-[state=active]:text-[#0B1E66] data-[state=active]:shadow-sm px-4 py-2 text-[#808080]"
            >
              Promo Code
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="data-[state=active]:bg-[#E8EEFF] data-[state=active]:text-[#0B1E66] data-[state=active]:shadow-sm px-4 py-2 text-[#808080]"
            >
              FAQ
            </TabsTrigger>
          </TabsList>

          <Button
            onClick={() => {
              if (activeTab === "faq") {
                setIsCreateFaqModalOpen(true);
              } else if (activeTab === "promo-code") {
                setIsCreatePromoCodeModalOpen(true);
              } else {
                setIsCreateBannerModalOpen(true);
              }
            }}
            className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white h-[40px]"
          >
            {activeTab === "faq"
              ? "+ Add FAQ"
              : activeTab === "promo-code"
              ? "+ Create New Promo Code"
              : "+ New Banner"}
          </Button>
        </div>

        <TabsContent value="banners">
          <BannersContent />
        </TabsContent>

        <TabsContent value="promo-code">
          <PromoCodeContent />
        </TabsContent>

        <TabsContent value="faq">
          <FaqContent />
        </TabsContent>
      </Tabs>

      <CreateBannerModal
        isOpen={isCreateBannerModalOpen}
        onClose={() => setIsCreateBannerModalOpen(false)}
      />

      <CreatePromoCodeModal
        isOpen={isCreatePromoCodeModalOpen}
        onClose={() => setIsCreatePromoCodeModalOpen(false)}
      />

      <CreateFaqModal
        isOpen={isCreateFaqModalOpen}
        onClose={() => setIsCreateFaqModalOpen(false)}
      />
    </div>
  );
}
