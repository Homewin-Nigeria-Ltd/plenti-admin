// components/NotificationTemplates.tsx
"use client";

import { EllipsisVertical, Eye } from "lucide-react";
import React, { useState } from "react";

interface Template {
  id: string;
  tags: { label: string; color: string; bgColor: string }[];
  title: string;
  subject: string;
  preview: string;
  variables: string[];
  uses: number;
  lastUsed: string;
  enabled: boolean;
}

const NotificationTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      tags: [
        {
          label: "Transactional",
          color: "text-green-700",
          bgColor: "bg-green-50",
        },
        { label: "Email", color: "text-yellow-700", bgColor: "bg-yellow-50" },
      ],
      title: "Order Confirmation",
      subject: "Your Order #{{order_id}} is Confirmed!",
      preview:
        "Hi {{customer_name}}, Your order #{{order_id}} has been confirmed and is being processed.",
      variables: ["{{customer_name}}", "{{order_id}}", "{{delivery_date}}"],
      uses: 1240,
      lastUsed: "2026-03-15",
      enabled: true,
    },
    {
      id: "2",
      tags: [
        { label: "Alert", color: "text-red-600", bgColor: "bg-red-50" },
        { label: "In-app", color: "text-orange-600", bgColor: "bg-orange-50" },
      ],
      title: "Low Stock Alert",
      subject: "Stock Alert: {{product_name}} Running Low",
      preview:
        "Alert: {{product_name}} stock is critically low. Current Stock: {{current_stock}} units",
      variables: ["{{product_name}}", "{{current_stock}}", "{{reorder_point}}"],
      uses: 89,
      lastUsed: "2026-03-14",
      enabled: true,
    },
    {
      id: "3",
      tags: [
        {
          label: "Transactional",
          color: "text-green-700",
          bgColor: "bg-green-50",
        },
        { label: "Email", color: "text-yellow-700", bgColor: "bg-yellow-50" },
      ],
      title: "Payment Received",
      subject: "Payment of ₦{{amount}} Received",
      preview:
        "Hi {{user_name}}, We have received your payment of ₦{{amount}} for order #{{order_id}}.",
      variables: ["{{user_name}}", "{{amount}}", "{{order_id}}", "{{tx_ref}}"],
      uses: 3402,
      lastUsed: "2026-03-14",
      enabled: true,
    },
  ]);

  const toggleTemplate = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
    );
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="w-full p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Header: Tags and Toggle */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-2 flex-wrap">
                {template.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium ${tag.bgColor} ${tag.color}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
              <button
                onClick={() => toggleTemplate(template.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  template.enabled ? "bg-blue-900" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    template.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Title and Subject */}
            <h3 className="text-lg font-bold text-blue-950 mb-1">
              {template.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4">{template.subject}</p>

            {/* Preview Box */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-600 text-sm leading-relaxed">
                {template.preview}
              </p>
            </div>

            {/* Variables */}
            <div className="flex flex-wrap gap-2 mb-6">
              {template.variables.map((variable, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-[#FEFEEB] text-[#ADA605] text-xs rounded font-mono"
                >
                  {variable}
                </span>
              ))}
            </div>

            {/* Footer: Stats and Menu */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Eye />
                  {formatNumber(template.uses)} uses
                </div>
                <div>Last: {template.lastUsed}</div>
              </div>

              <button className="p-2 hover:bg-gray-100 rounded-[3px] transition-colors bg-[#E8EEFF]">
                <EllipsisVertical size={20} className="rotate-90" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationTemplates;
