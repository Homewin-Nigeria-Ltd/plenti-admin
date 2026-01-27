"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, RefreshCcw, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { useUserStore } from "@/store/useUserStore";
import { generatePassword } from "@/lib/password";

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const roles: Array<{ label: string; value: "admin" | "customer" }> = [
  { label: "Admin", value: "admin" },
  { label: "Customer", value: "customer" },
];

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const { createUser, creatingUser } = useUserStore();
  const [formData, setFormData] = React.useState({
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    position: "",
    phone: "",
    role: "admin" as "admin" | "customer",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<{
    email?: string;
    phone?: string;
  }>({});

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setFormData((prev) => ({ ...prev, password: newPassword }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const res = await createUser({
      ...formData,
    });

    if (!res.ok) {
      const phoneErr = res.errors?.phone?.[0];
      const emailErr = res.errors?.email?.[0];
      setFieldErrors({
        phone: phoneErr,
        email: emailErr,
      });
      toast.error(res.message || "Failed to add user");
      return;
    }

    toast.success(res.data.message || "User added successfully", {
      description: res.data.generated_password
        ? `Password: ${res.data.generated_password}`
        : undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      department: "",
      position: "",
      phone: "",
      role: "admin",
      password: "",
    });
    setFieldErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] flex flex-col p-0 w-[95vw] sm:w-full"
        showCloseButton={false}
      >
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 relative">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full"
          >
            <X color="#0B1E66" size={20} cursor="pointer" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3 pr-10 sm:pr-12">
            <div className="size-8 sm:size-10 rounded-lg bg-linear-to-br from-purple-400 via-blue-400 to-green-400 flex items-center justify-center shrink-0">
              <svg
                className="size-5 sm:size-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-left">
                Add User
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-neutral-500 text-left mt-1">
                This feature allows admins to easily add new users to the Plenti
                admin. Each user&apos;s access level is set based on their role,
                ensuring they have the right permissions for their tasks.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      first_name: e.target.value,
                    }))
                  }
                  className="form-control bg-neutral-100! border-0! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      last_name: e.target.value,
                    }))
                  }
                  className="form-control bg-neutral-100! border-0! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="form-control bg-neutral-100! border-0! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                required
              />
              {fieldErrors.email ? (
                <p className="text-xs text-red-500">{fieldErrors.email}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="form-control bg-neutral-100! border-0! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                required
              />
              {fieldErrors.phone ? (
                <p className="text-xs text-red-500">{fieldErrors.phone}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  className="form-control bg-neutral-100! border-0! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Position"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      position: e.target.value,
                    }))
                  }
                  className="form-control bg-neutral-100! border-0! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: value as "admin" | "customer",
                  }))
                }
              >
                <SelectTrigger className="form-control bg-neutral-100! border-0! w-full! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="form-control bg-neutral-100! border-0! pr-[300px] sm:pr-56! focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                  required
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-[#E8EEFF] text-primary rounded-md text-xs sm:text-sm font-medium hover:bg-[#D4E0FF] transition-colors whitespace-nowrap"
                  >
                    <RefreshCcw className="size-3 sm:size-4 shrink-0" />
                    <span className="hidden sm:inline">Generate Password</span>
                    <span className="sm:hidden">Generate</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 pb-4 sm:pb-6 px-4 sm:px-6 border-t border-neutral-100">
            <button
              type="submit"
              disabled={creatingUser}
              className="btn btn-primary w-full h-11 sm:h-12 font-semibold rounded-md"
            >
              {creatingUser ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
