"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
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
  const [selectedIntegration, setSelectedIntegration] =
    React.useState<Integration | null>(null);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = React.useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary w-full sm:w-auto"
        >
          <Plus className="size-4 mr-2" />
          Add New Integration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-white rounded-lg border border-neutral-100 p-4 sm:p-6"
          >
            <div className="mb-3 sm:mb-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src="/placeholder.png"
                      alt={integration.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-primary-700 text-base">
                    {integration.name}
                  </h3>
                </div>
                <span className="badge badge-success whitespace-nowrap">
                  {integration.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-500">
                  {integration.category}
                </p>
                <p className="text-xs text-neutral-500">
                  Last sync: {integration.lastSync}
                </p>
              </div>
            </div>

            <Button
              onClick={() => {
                setSelectedIntegration(integration);
                setIsConfigureModalOpen(true);
              }}
              className="btn-primary w-full h-[40px] rounded-[8px] mt-10"
            >
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
