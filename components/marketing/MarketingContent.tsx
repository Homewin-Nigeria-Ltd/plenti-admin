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
import { getMarketingPermissions } from "@/lib/modulePermissions";
import { useAccountStore } from "@/store/useAccountStore";

export default function MarketingContent() {
  const account = useAccountStore((state) => state.account);
  const { canCreateBanner, canCreatePromo } = getMarketingPermissions(account);
  const [activeTab, setActiveTab] = React.useState("banners");
  const [isCreateBannerModalOpen, setIsCreateBannerModalOpen] =
    React.useState(false);
  const [isCreatePromoCodeModalOpen, setIsCreatePromoCodeModalOpen] =
    React.useState(false);
  const [isCreateFaqModalOpen, setIsCreateFaqModalOpen] = React.useState(false);

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <TabsList className="bg-transparent p-0 h-auto gap-2 overflow-x-auto justify-start max-w-full">
            <TabsTrigger
              value="banners"
              className="data-[state=active]:bg-[#E8EEFF] data-[state=active]:text-[#0B1E66] data-[state=active]:shadow-sm px-4 py-2 text-[#808080] shrink-0"
            >
              Banners
            </TabsTrigger>
            <TabsTrigger
              value="promo-code"
              className="data-[state=active]:bg-[#E8EEFF] data-[state=active]:text-[#0B1E66] data-[state=active]:shadow-sm px-4 py-2 text-[#808080] shrink-0"
            >
              Promo Code
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="data-[state=active]:bg-[#E8EEFF] data-[state=active]:text-[#0B1E66] data-[state=active]:shadow-sm px-4 py-2 text-[#808080] shrink-0"
            >
              FAQ
            </TabsTrigger>
          </TabsList>

          {canCreateBanner && activeTab === "banners" && (
            <Button
              onClick={() => setIsCreateBannerModalOpen(true)}
              className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white h-[40px] w-full sm:w-auto"
            >
              + New Banner
            </Button>
          )}

          {canCreatePromo && activeTab === "promo-code" && (
            <Button
              onClick={() => setIsCreatePromoCodeModalOpen(true)}
              className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white h-[40px] w-full sm:w-auto"
            >
              + New Promo Code
            </Button>
          )}

          {activeTab === "faq" && (
            <Button
              onClick={() => setIsCreateFaqModalOpen(true)}
              className="bg-[#1F3A78] hover:bg-[#1F3A78]/90 text-white h-[40px] w-full sm:w-auto"
            >
              + Add FAQ
            </Button>
          )}
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
