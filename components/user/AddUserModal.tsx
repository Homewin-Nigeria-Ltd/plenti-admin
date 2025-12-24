"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, RefreshCcw, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const roles = ["Admin", "Super Admin", "Manager", "Editor", "Viewer"];

const generatePassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [position, setPosition] = React.useState("");
  const [role, setRole] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleGeneratePassword = () => {
    const newPassword = generatePassword();
    setPassword(newPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      firstName,
      lastName,
      email,
      department,
      position,
      role,
      password,
    });
    toast.success("User added successfully");
    handleClose();
  };

  const handleClose = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setDepartment("");
    setPosition("");
    setRole("");
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] flex flex-col p-0 w-[95vw] sm:w-full"
        showCloseButton={false}>
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 relative">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close dialog"
            className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center justify-center size-[30px] bg-[#E8EEFF] rounded-full">
            <X color="#0B1E66" size={20} cursor="pointer" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3 pr-10 sm:pr-12">
            <div className="size-8 sm:size-10 rounded-lg bg-gradient-to-br from-purple-400 via-blue-400 to-green-400 flex items-center justify-center shrink-0">
              <svg
                className="size-5 sm:size-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
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
                This feature allows admins to easily add new users to the Plenti admin. Each user's access level is set based on their role, ensuring they have the right permissions for their tasks.
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="form-control !bg-neutral-100 !border-0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="form-control !bg-neutral-100 !border-0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control !bg-neutral-100 !border-0"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="form-control !bg-neutral-100 !border-0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="form-control !bg-neutral-100 !border-0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="form-control !bg-neutral-100 !border-0 !w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control !bg-neutral-100 !border-0 !pr-[300px] sm:!pr-56"
                  required
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-700 transition-colors">
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-[#E8EEFF] text-primary rounded-md text-xs sm:text-sm font-medium hover:bg-[#D4E0FF] transition-colors whitespace-nowrap">
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
              className="btn btn-primary w-full h-11 sm:h-12 font-semibold rounded-md">
              Submit
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
