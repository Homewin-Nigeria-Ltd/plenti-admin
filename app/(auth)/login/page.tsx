import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="min-h-screen w-screen grid grid-cols-2 p-10 overflow-hidden">
      <div className="place-items-center place-content-center">
        <Image
          src={"/login-display.svg"}
          alt="Plenti"
          width={170}
          height={70}
          className="h-[90vh] w-auto"
          fetchPriority="high"
        />
      </div>
      <div className="place-content-center">
        <h1 className="text-[#101928] font-bold text-[40px]">Welcome Back</h1>
        <p className="text-secondary text-[16px] font-normal mb-10">
          Welcome Back! Please enter your credentials to access your account and
          continue managing your business effortlessly.
        </p>
        <LoginForm />
        <p className="text-[16px] font-normal text-secondary/50 text-center mt-3">
          Forgot Password?{" "}
          <span className="underline text-primary cursor-pointer">
            Reach to Admin
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
