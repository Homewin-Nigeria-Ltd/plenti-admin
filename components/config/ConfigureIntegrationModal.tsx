"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

type ConfigureIntegrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  integration: {
    id: string;
    name: string;
    category: string;
    status: "Connected" | "Disconnected";
    lastSync: string;
  } | null;
};

export function ConfigureIntegrationModal({
  isOpen,
  onClose,
  integration,
}: ConfigureIntegrationModalProps) {
  const [secretKey, setSecretKey] = React.useState("");
  const [publicKey, setPublicKey] = React.useState("");

  React.useEffect(() => {
    if (integration) {
      setSecretKey("");
      setPublicKey("");
    }
  }, [integration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      integrationId: integration?.id,
      secretKey,
      publicKey,
    });
    onClose();
    setSecretKey("");
    setPublicKey("");
  };

  if (!integration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-4 sm:p-6 w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            API Keys & Credentials
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            Configure API keys for {integration.name}
          </DialogDescription>
        </DialogHeader>

        <form id="configure-integration-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="space-y-2">
            <Label htmlFor="configure-secretKey" className="text-sm font-medium text-primary-700">
              Secret Key
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-neutral-500 pointer-events-none" />
              <Input
                id="configure-secretKey"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter Password"
                className="focus-visible:ring-0 pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="configure-publicKey" className="text-sm font-medium text-primary-700">
              Public Key
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-neutral-500 pointer-events-none" />
              <Input
                id="configure-publicKey"
                type="password"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="Enter New Password"
                className="focus-visible:ring-0 pl-10"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" form="configure-integration-form" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
              Update Provider
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
