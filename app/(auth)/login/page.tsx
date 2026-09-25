import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <div className="min-h-dvh w-full grid grid-cols-1 lg:grid-cols-2 px-5 py-8 sm:px-8 lg:p-10 gap-8 lg:gap-10">
      <div className="hidden lg:grid place-items-center place-content-center min-w-0">
        <Image
          src={"/login-display.svg"}
          alt="Plenti"
          width={170}
          height={70}
          className="h-[min(90vh,800px)] w-auto max-w-full"
          priority
        />
      </div>

      <div className="flex flex-col justify-center w-full max-w-md mx-auto lg:max-w-none min-w-0">
        <div className="lg:hidden flex justify-center mb-6">
          <Image
            src={"/login-display.svg"}
            alt="Plenti"
            width={170}
            height={70}
            className="h-36 sm:h-44 w-auto"
            priority
          />
        </div>

        <h1 className="text-[#101928] font-bold text-[28px] sm:text-[32px] lg:text-[40px]">
          Welcome Back
        </h1>
        <p className="text-secondary text-sm sm:text-base font-normal mb-6 lg:mb-10">
          Welcome Back! Please enter your credentials to access your account and
          continue managing your business effortlessly.
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
        <p className="text-sm sm:text-base font-normal text-secondary/50 text-center mt-3">
          Forgot Password?{" "}
          <a
            href="mailto:sales@plentinig.com"
            className="underline text-primary cursor-pointer"
          >
            Reach to Admin
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
