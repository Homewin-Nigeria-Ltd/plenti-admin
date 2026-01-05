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
import { Raleway } from "next/font/google";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const loginFormSchema = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" }),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const LoginForm = () => {
  const { login } = useAuthStore();
  const router = useRouter();
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormSchema) {
    // console.log(values);
    login(values)
      .then((res) => console.log(res))
      .catch((err) => console.log("Login error =>", err));
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* EMAIL  */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`text-[#878787] ${raleway.className}`}>
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Input email address"
                  className="rounded-[6px] h-13.75 border-[#D0D5DD] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PASSWORD  */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={`text-[#878787] ${raleway.className}`}>
                Password
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Input password"
                  className="rounded-[6px] h-13.75 border-[#D0D5DD] border"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-10">
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
