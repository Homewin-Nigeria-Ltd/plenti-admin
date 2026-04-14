"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationOverview from "./Overview/NotificationOverview";
import NotificationTemplates from "./Template/NotificationTemplates";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateTemplateModal from "./Template/CreateTemplateModal";
import CampaignAnalytics from "./Campaign/CampaignAnalytics";
import CreateCampaignModal from "./Campaign/CreateCampaignModal";
import QuickSendNotification from "./QuickSend/QuickSendNotification";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import {
  CreateCampaignPayload,
  CreateTemplateRequest,
} from "@/types/NotificationTypes";

const NotificationManagementContent = () => {
  const createTemplate = useNotificationsStore((state) => state.createTemplate);
  const createCampaign = useNotificationsStore((state) => state.createCampaign);

  const [isAddTemplateModal, setIsAddTemplateModal] = useState(false);
  const [isAddCampaignModal, setIsAddCampaignModal] = useState(false);
  const [loadingCampaign, setLoadingCampaign] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    {
      title: "Overview",
      value: "overview",
    },
    {
      title: "Template",
      value: "template",
    },
    {
      title: "Campaign",
      value: "campaign",
    },
    {
      title: "Quick Send",
      value: "quick-send",
    },
  ];

  const handleCreateTemplate = async (data: CreateTemplateRequest) => {
    const isSuccess = await createTemplate(data);

    if (isSuccess) {
      setIsAddTemplateModal(false);
    } else {
      console.error("Template creation failed in the store.");
    }
  };

  const handleCreateCampaign = async (data: CreateCampaignPayload) => {
    setLoadingCampaign(true);
    const isSuccess = await createCampaign(data).finally(() =>
      setLoadingCampaign(false),
    );

    if (isSuccess) {
      setIsAddCampaignModal(false);
    } else {
      console.error("Campaign creation failed in the store");
    }
  };

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="overview"
      >
        <div className="flex justify-between items-center">
          <TabsList className="bg-transparent gap-5">
            {tabs.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={tab.value}
                className="data-[state=active]:bg-[#E8EEFF]! rounded-none text-[#808080] data-[state=active]:text-[#0B1E66] text-[16px] font-medium px-5 py-3"
              >
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {activeTab === "template" && (
            <button
              className="bg-[#0B1E66] rounded-lg text-white px-4 py-2 flex items-center gap-3 animate-in fade-in duration-300"
              onClick={() => setIsAddTemplateModal(true)}
            >
              <Plus size={18} />
              Add Template
            </button>
          )}
          {activeTab === "campaign" && (
            <button
              className="bg-[#0B1E66] rounded-lg text-white px-4 py-2 flex items-center gap-3 animate-in fade-in duration-300"
              onClick={() => setIsAddCampaignModal(true)}
            >
              <Plus size={18} />
              Add Campaign
            </button>
          )}
        </div>

        <TabsContent value="overview">
          <NotificationOverview />
        </TabsContent>
        <TabsContent value="template">
          <NotificationTemplates />
        </TabsContent>
        <TabsContent value="campaign">
          <CampaignAnalytics />
        </TabsContent>
        <TabsContent value="quick-send">
          <QuickSendNotification />
        </TabsContent>
      </Tabs>

      {/* Models  */}
      <CreateTemplateModal
        open={isAddTemplateModal}
        onOpenChange={setIsAddTemplateModal}
        onSubmit={handleCreateTemplate}
      />
      <CreateCampaignModal
        open={isAddCampaignModal}
        onOpenChange={setIsAddCampaignModal}
        onSubmit={handleCreateCampaign}
        loading={loadingCampaign}
      />
    </>
  );
};

export default NotificationManagementContent;
