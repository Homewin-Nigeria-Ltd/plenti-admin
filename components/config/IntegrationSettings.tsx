"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddIntegrationModal } from "./AddIntegrationModal";
import { ConfigureIntegrationModal } from "./ConfigureIntegrationModal";

type Integration = {
  id: string;
  name: string;
  category: string;
  status: "Connected" | "Disconnected";
  lastSync: string;
  logo?: React.ReactNode;
};

const integrations: Integration[] = [
  {
    id: "paystack-1",
    name: "Paystack",
    category: "Payment Gateway",
    status: "Connected",
    lastSync: "1 hour ago",
  },
  {
    id: "paystack-2",
    name: "Paystack",
    category: "Payment Gateway",
    status: "Connected",
    lastSync: "1 hour ago",
  },
  {
    id: "dhl-api",
    name: "DHL API",
    category: "Delivery Service",
    status: "Connected",
    lastSync: "1 hour ago",
  },
  {
    id: "gig-logistics",
    name: "GIG Logistics",
    category: "Delivery Service",
    status: "Connected",
    lastSync: "1 hour ago",
  },
];

export default function IntegrationSettings() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedIntegration, setSelectedIntegration] = React.useState<Integration | null>(null);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="size-4 mr-2" />
          Add New Integration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-white rounded-lg border border-neutral-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {integration.id === "paystack-1" ? (
                  <div className="size-10 rounded-lg flex items-center justify-center">
                    <div className="relative size-8">
                      <div className="absolute top-0 left-0 size-4 bg-orange-500 rounded-full"></div>
                      <div className="absolute bottom-0 right-0 size-4 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                ) : (
                  <div className="size-10 rounded-lg bg-primary-50 flex items-center justify-center">
                    <div className="flex flex-col gap-0.5">
                      <div className="w-5 h-0.5 bg-primary rounded"></div>
                      <div className="w-5 h-0.5 bg-primary rounded"></div>
                      <div className="w-5 h-0.5 bg-primary rounded"></div>
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-primary-700 text-base">
                    {integration.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    {integration.category}
                  </p>
                </div>
              </div>
              <span className="badge badge-success whitespace-nowrap">
                {integration.status}
              </span>
            </div>

            <p className="text-xs text-neutral-500 mb-4">
              Last sync: {integration.lastSync}
            </p>

            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              Configure
            </Button>
          </div>
        ))}
      </div>

      <AddIntegrationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <ConfigureIntegrationModal
        isOpen={isConfigureModalOpen}
        onClose={() => {
          setIsConfigureModalOpen(false);
          setSelectedIntegration(null);
        }}
        integration={selectedIntegration}
      />
    </div>
  );
}
