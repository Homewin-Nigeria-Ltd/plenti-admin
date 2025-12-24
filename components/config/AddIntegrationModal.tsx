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

type AddIntegrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddIntegrationModal({ isOpen, onClose }: AddIntegrationModalProps) {
  const [secretKey, setSecretKey] = React.useState("");
  const [publicKey, setPublicKey] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      secretKey,
      publicKey,
    });
    onClose();
    setSecretKey("");
    setPublicKey("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-4 sm:p-6 w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold">
            API Keys & Credentials
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-neutral-500">
            Enter your API keys and credentials to add a new integration
          </DialogDescription>
        </DialogHeader>

        <form id="add-integration-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="space-y-2">
            <Label htmlFor="secretKey" className="text-sm font-medium text-primary-700">
              Secret Key
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-500 pointer-events-none z-10" />
              <Input
                id="secretKey"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter Secret Key"
                className="form-control !pl-[48px]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publicKey" className="text-sm font-medium text-primary-700">
              Public Key
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-500 pointer-events-none z-10" />
              <Input
                id="publicKey"
                type="password"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="Enter Public Key"
                className="form-control !pl-[48px]"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" form="add-integration-form" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
              Add New Provider
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
