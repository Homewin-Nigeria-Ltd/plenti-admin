import LoginBrandPanel from "@/components/auth/LoginBrandPanel";
import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <div className="min-h-dvh w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
      <section className="min-h-dvh flex flex-col px-6 py-8 sm:px-10 lg:px-14 xl:px-20">
        <div className="flex items-center gap-2.5">
          <span className="size-8 rounded-[10px] bg-[#2F5BDB] text-white text-sm font-semibold inline-flex items-center justify-center">
            P
          </span>
          <p className="text-[15px] font-semibold text-[#101828]">
            Plenti{" "}
            <span className="font-medium text-[#98A2B3]">Admin</span>
          </p>
        </div>

        <div className="flex-1 flex items-center pb-[8vh]">
          <div className="w-full max-w-[400px]">
            <h1 className="text-[28px] leading-8 font-semibold text-[#101828] tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-[#667085]">
              Sign in to Plenti Admin with your work email.
            </p>
            <div className="mt-8">
              <Suspense
                fallback={
                  <div className="h-40 rounded-xl bg-[#F2F4F7] animate-pulse" />
                }
              >
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>

        <p className="text-[12px] text-[#98A2B3]">
          © {new Date().getFullYear()} Plenti.{" "}
          <a href="#" className="hover:text-[#667085]">
            Privacy
          </a>
          {" · "}
          <a href="#" className="hover:text-[#667085]">
            Terms
          </a>
        </p>
      </section>

      <LoginBrandPanel />
    </div>
  );
};

export default LoginPage;
