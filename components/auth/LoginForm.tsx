"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { AlertCircle, Eye, EyeOff, Loader2Icon, Lock } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const loginFormSchema = z.object({
  email: z.email({ error: "Enter a valid work email" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" }),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

const LoginForm = () => {
  const { login, loading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormSchema) {
    setAuthError(null);
    try {
      const res = await login(values);
      if (res) {
        toast.success("Login successful", {
          description: "You are now logged in",
        });
        const redirect = searchParams.get("redirect");
        router.push(redirect || "/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Please check your credentials";
      setAuthError(errorMessage);
      form.setError("password", {
        message: "Check your password and try again",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {authError ? (
          <div className="rounded-xl bg-[#FEF3F2] border border-[#FECDCA] px-3.5 py-3 text-[13px] text-[#B42318]">
            <p className="font-medium inline-flex items-start gap-2">
              <AlertCircle className="size-4 mt-0.5 shrink-0" />
              <span>Email or password is incorrect</span>
            </p>
            <p className="mt-1 pl-6 text-[#D92D20]/90">{authError}</p>
          </div>
        ) : null}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[13px] text-[#344054] font-medium">
                Work email
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="adaeze.okafor@plenti.ng"
                  className="h-11 rounded-lg border-[#D0D5DD] shadow-none"
                  {...field}
                  onChange={(event) => {
                    setAuthError(null);
                    field.onChange(event);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className="text-[13px] text-[#344054] font-medium">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98A2B3]" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={cn(
                      "h-11 rounded-lg border-[#D0D5DD] shadow-none pl-9 pr-10",
                      fieldState.error && "border-[#F04438] focus-visible:border-[#F04438]",
                    )}
                    {...field}
                    onChange={(event) => {
                      setAuthError(null);
                      field.onChange(event);
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#667085]"
                    onClick={() => setShowPassword((open) => !open)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end">
          <a
            href="mailto:sales@plentinig.com"
            className="text-[13px] font-medium text-[#2F5BDB] shrink-0"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-[#2F5BDB] hover:bg-[#2F5BDB]/90 text-sm font-medium"
          disabled={loading}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <Loader2Icon className="size-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
