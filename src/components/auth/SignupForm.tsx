import React from "react";
import { FaUser, FaLock, FaEnvelope, FaSpinner } from "react-icons/fa";
import AuthInput from "./AuthInput";
import SocialIcons from "./SocialIcons";

export default function SignupForm({
  isSignUpMode,
  signUpData,
  setSignUpData,
  onSubmit,
  loading = false,
}: {
  isSignUpMode: boolean;
  signUpData: { username: string; email: string; password: string };
  setSignUpData: React.Dispatch<
    React.SetStateAction<{ username: string; email: string; password: string }>
  >;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={[
        "flex items-center justify-center flex-col",
        "col-start-1 col-end-2 row-start-1 row-end-2",
        "overflow-hidden",
        "transition-opacity duration-200 delay-700 ease-in-out",
        "2xl:px-24 xl:px-20 lg:px-16 md:px-12 sm:px-6 px-3",
        isSignUpMode ? "z-[2] opacity-100" : "z-[1] opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <h2 className="font-poppins 2xl:text-5xl xl:text-4xl lg:text-3xl md:text-3xl sm:text-2xl text-[1.4rem] text-gray-700 mb-3 font-semibold">
        Sign up
      </h2>

      <AuthInput
        icon={FaUser}
        type="text"
        placeholder="Username"
        value={signUpData.username}
        onChange={(v) => setSignUpData((p) => ({ ...p, username: v }))}
        wrapperClassName="w-full 2xl:max-w-[420px] xl:max-w-[380px] lg:max-w-[360px] md:max-w-[340px] sm:max-w-[320px] max-w-full bg-white 2xl:h-16 xl:h-14 lg:h-13 md:h-12 sm:h-12 h-11 my-1.5 rounded-full grid grid-cols-[15%_85%] sm:grid-cols-[15%_85%] grid-cols-[20%_80%] px-1.5 shadow-md border border-gray-100"
      />

      <AuthInput
        icon={FaEnvelope}
        type="email"
        placeholder="Email"
        value={signUpData.email}
        onChange={(v) => setSignUpData((p) => ({ ...p, email: v }))}
        wrapperClassName="w-full 2xl:max-w-[420px] xl:max-w-[380px] lg:max-w-[360px] md:max-w-[340px] sm:max-w-[320px] max-w-full bg-white 2xl:h-16 xl:h-14 lg:h-13 md:h-12 sm:h-12 h-11 my-1.5 rounded-full grid grid-cols-[15%_85%] sm:grid-cols-[15%_85%] grid-cols-[20%_80%] px-1.5 shadow-md border border-gray-100"
      />

      <AuthInput
        icon={FaLock}
        type="password"
        placeholder="Password"
        value={signUpData.password}
        onChange={(v) => setSignUpData((p) => ({ ...p, password: v }))}
        wrapperClassName="w-full 2xl:max-w-[420px] xl:max-w-[380px] lg:max-w-[360px] md:max-w-[340px] sm:max-w-[320px] max-w-full bg-white 2xl:h-16 xl:h-14 lg:h-13 md:h-12 sm:h-12 h-11 my-1.5 rounded-full grid grid-cols-[15%_85%] sm:grid-cols-[20%_80%] grid-cols-[20%_80%] px-1.5 shadow-md border border-gray-100"
      />

      <button
        type="submit"
        disabled={
          loading ||
          !signUpData.username.trim() ||
          !signUpData.email.trim() ||
          !signUpData.password
        }
        className={[
          "bg-[#5995fd] hover:bg-[#4d84e2] border-none outline-none rounded-full cursor-pointer",
          "text-white uppercase font-semibold transition-colors duration-300",
          "2xl:h-14 2xl:w-40 2xl:text-base xl:h-12 xl:w-36 xl:text-base lg:h-11 lg:w-32 lg:text-sm md:h-11 md:w-32 md:text-sm sm:h-11 sm:w-32 sm:text-sm h-11 w-32 text-sm my-3 mt-4",
          loading ||
          !signUpData.username.trim() ||
          !signUpData.email.trim() ||
          !signUpData.password
            ? "opacity-70 pointer-events-none cursor-not-allowed"
            : "",
        ].join(" ")}
      >
        {loading ? (
          <span className="inline-flex items-center justify-center gap-2">
            <FaSpinner className="animate-spin w-4 h-4" aria-hidden />
            Signing up...
          </span>
        ) : (
          "Signup"
        )}
      </button>

      <p className="py-1.5 2xl:text-base xl:text-base lg:text-sm md:text-sm sm:text-sm text-xs text-center text-gray-600 font-mono">
        Or sign up with social accounts
      </p>

      <SocialIcons />
    </form>
  );
}
