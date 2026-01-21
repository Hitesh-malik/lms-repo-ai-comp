"use client";

import React, { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

interface AuthFormProps {
  onSignIn?: (data: { username: string; password: string }) => void;
  onSignUp?: (data: { username: string; email: string; password: string }) => void;

  // ✅ Added for TanStack integration (optional)
  signInLoading?: boolean;
  signUpLoading?: boolean;
  signInError?: string | null;
  signUpError?: string | null;

  loginImage?: string;
  registerImage?: string;
}

export default function AuthForm({
  onSignIn,
  onSignUp,

  // ✅ Added for TanStack integration (default values)
  signInLoading = false,
  signUpLoading = false,
  signInError = null,
  signUpError = null,

  loginImage = "/img/log.svg",
  registerImage = "/img/register.svg",
}: AuthFormProps) {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signInData, setSignInData] = useState({ username: "", password: "" });
  const [signUpData, setSignUpData] = useState({ username: "", email: "", password: "" });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (signInLoading) return;
    onSignIn?.(signInData);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpLoading) return;
    onSignUp?.(signUpData);
  };

  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* ✅ Small error toast-like message (no layout change) */}
      {(signInError || signUpError) && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow">
          {isSignUpMode ? signUpError : signInError}
        </div>
      )}

      {/* Desktop/Tablet: Animated Background Circle */}
      <div
        className={[
          "absolute bg-gradient-to-br from-[#4481eb] to-[#04befe] rounded-full z-10",
          "transition-all duration-[1800ms] ease-in-out",
          "hidden md:block",
          "2xl:w-[2200px] 2xl:h-[2200px]",
          "xl:w-[2000px] xl:h-[2000px] xl:-top-[10%]",
          isSignUpMode ? "xl:right-[52%] xl:translate-x-full" : "xl:right-[48%] xl:-translate-y-1/2",
          "lg:w-[1800px] lg:h-[1800px] lg:-top-[8%]",
          isSignUpMode ? "lg:right-[52%] lg:translate-x-full" : "lg:right-[48%] lg:-translate-y-1/2",
          "md:w-[1500px] md:h-[1500px] md:-top-[5%]",
          isSignUpMode ? "md:right-[52%] md:translate-x-full" : "md:right-[48%] md:-translate-y-1/2",
        ].join(" ")}
      />

      {/* Mobile: Curved Header Background (Sign In Mode) */}
      <div
        className={[
          "md:hidden absolute top-0 left-0 w-full z-10",
          "bg-gradient-to-br from-[#4481eb] to-[#04befe]",
          "transition-all duration-[1200ms] ease-in-out",
          isSignUpMode ? "h-[28vh] -translate-y-full opacity-0" : "h-[28vh] translate-y-0 opacity-100",
        ].join(" ")}
        style={{ clipPath: "ellipse(150% 100% at 50% 0%)" }}
      />

      {/* Mobile: Curved Footer Background (Sign Up Mode) */}
      <div
        className={[
          "md:hidden absolute bottom-0 left-0 w-full z-10",
          "bg-gradient-to-br from-[#4481eb] to-[#04befe]",
          "transition-all duration-[1200ms] ease-in-out",
          isSignUpMode ? "h-[35vh] translate-y-0 opacity-100" : "h-[35vh] translate-y-full opacity-0",
        ].join(" ")}
        style={{ clipPath: "ellipse(150% 100% at 50% 100%)" }}
      />

      {/* Forms Container */}
      <div className="absolute w-full h-full top-0 left-0">
        {/* Sign In / Sign Up Forms */}
        <div
          className={[
            "absolute grid grid-cols-1 z-20",
            "transition-all duration-1000 ease-in-out",
            "2xl:w-[45%]",
            "xl:w-1/2 xl:top-1/2 xl:-translate-y-1/2 xl:-translate-x-1/2",
            isSignUpMode ? "xl:left-1/4" : "xl:left-3/4",
            "lg:w-[55%] lg:top-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2",
            isSignUpMode ? "lg:left-1/4" : "lg:left-3/4",
            "md:w-[65%] md:top-1/2 md:-translate-y-1/2 md:-translate-x-1/2",
            isSignUpMode ? "md:left-1/4" : "md:left-3/4",
            "w-full left-1/2 -translate-x-1/2 px-6",
            isSignUpMode ? "top-[40%] -translate-y-1/2" : "top-[55%] -translate-y-1/2",
            "sm:px-8",
          ].join(" ")}
        >
          <LoginForm
            isSignUpMode={isSignUpMode}
            signInData={signInData}
            setSignInData={setSignInData}
            onSubmit={handleSignIn}
            // ✅ pass loading so Login button can disable/spinner
            loading={signInLoading}
          />

          <SignupForm
            isSignUpMode={isSignUpMode}
            signUpData={signUpData}
            setSignUpData={setSignUpData}
            onSubmit={handleSignUp}
            // ✅ pass loading so Signup button can disable/spinner
            loading={signUpLoading}
          />
        </div>

        {/* Desktop/Tablet: Panels Container */}
        <div className="w-full h-full absolute top-0 left-0 md:grid md:grid-cols-2 hidden">
          {/* Left Panel */}
          <div
            className={[
              "flex flex-col justify-center items-center text-center z-[13]",
              "transition-all duration-900 ease-in-out",
              "2xl:px-[8%] xl:px-[8%] lg:px-[6%] md:px-[5%]",
              "2xl:py-16 xl:py-14 lg:py-12 md:py-10",
              isSignUpMode ? "pointer-events-none" : "pointer-events-auto",
            ].join(" ")}
          >
            <div
              className={[
                "text-white transition-all duration-900 ease-in-out",
                "max-w-md w-full",
                isSignUpMode ? "-translate-x-[800px]" : "translate-x-0",
              ].join(" ")}
            >
              <h3 className="font-semibold mb-4 2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg">
                New to learning?
              </h3>
              <p className="py-2 leading-relaxed 2xl:text-base xl:text-sm lg:text-sm md:text-xs mb-6 px-4">
                Join thousands of learners worldwide. Access expert-led courses, interactive lessons, and
                earn certificates to advance your career.
              </p>
              <button
                type="button"
                onClick={() => setIsSignUpMode(true)}
                disabled={signInLoading || signUpLoading}
                className={[
                  "font-poppins border-2 border-white bg-transparent hover:bg-white hover:text-[#4481eb] rounded-full cursor-pointer",
                  "text-white uppercase transition-all duration-300 font-semibold",
                  "2xl:w-36 2xl:h-12 2xl:text-sm xl:w-32 xl:h-11 xl:text-sm lg:w-28 lg:h-10 lg:text-xs md:w-24 md:h-9 md:text-[0.65rem]",
                  (signInLoading || signUpLoading) ? "opacity-60 pointer-events-none" : "",
                ].join(" ")}
              >
                Sign up
              </button>
            </div>

            <img
              src={loginImage}
              alt="Login illustration"
              className={[
                "w-full mt-8 transition-all duration-900 ease-in-out",
                "2xl:max-w-xs xl:max-w-[280px] lg:max-w-[240px] md:max-w-[200px]",
                isSignUpMode ? "-translate-x-[800px]" : "translate-x-0",
              ].join(" ")}
            />
          </div>

          {/* Right Panel */}
          <div
            className={[
              "flex flex-col justify-center items-center text-center z-[13]",
              "transition-all duration-900 ease-in-out",
              "2xl:px-[8%] xl:px-[8%] lg:px-[6%] md:px-[5%]",
              "2xl:py-16 xl:py-14 lg:py-12 md:py-10",
              isSignUpMode ? "pointer-events-auto" : "pointer-events-none",
            ].join(" ")}
          >
            <div
              className={[
                "text-white transition-all duration-900 ease-in-out",
                "max-w-md w-full",
                isSignUpMode ? "translate-x-0" : "translate-x-[800px]",
              ].join(" ")}
            >
              <h3 className="font-semibold mb-4 2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg">
                Already enrolled?
              </h3>
              <p className="py-2 leading-relaxed 2xl:text-base xl:text-sm lg:text-sm md:text-xs mb-6 px-4">
                Welcome back! Continue your learning journey, track your progress, and access your enrolled
                courses right where you left off.
              </p>
              <button
                type="button"
                onClick={() => setIsSignUpMode(false)}
                disabled={signInLoading || signUpLoading}
                className={[
                  "font-poppins border-2 border-white bg-transparent hover:bg-white hover:text-[#4481eb] rounded-full cursor-pointer",
                  "text-white uppercase transition-all duration-300 font-semibold",
                  "2xl:w-36 2xl:h-12 2xl:text-sm xl:w-32 xl:h-11 xl:text-sm lg:w-28 lg:h-10 lg:text-xs md:w-24 md:h-9 md:text-[0.65rem]",
                  (signInLoading || signUpLoading) ? "opacity-60 pointer-events-none" : "",
                ].join(" ")}
              >
                Sign in
              </button>
            </div>

            <img
              src={registerImage}
              alt="Register illustration"
              className={[
                "w-full mt-8 transition-all duration-900 ease-in-out",
                "2xl:max-w-xs xl:max-w-[280px] lg:max-w-[240px] md:max-w-[200px]",
                isSignUpMode ? "translate-x-0" : "translate-x-[800px]",
              ].join(" ")}
            />
          </div>
        </div>

        {/* Mobile: Panel Content Overlay */}
        <div className="md:hidden absolute w-full h-full top-0 left-0 pointer-events-none">
          {/* Sign In Mode - top */}
          <div
            className={[
              "absolute top-0 left-0 w-full z-[13]",
              "flex flex-col items-center justify-start text-center",
              "px-8 pt-6 pb-4",
              "transition-all duration-[1200ms] ease-in-out pointer-events-auto",
              isSignUpMode ? "opacity-0 invisible -translate-y-20" : "opacity-100 visible translate-y-0",
            ].join(" ")}
          >
            <div className="flex items-end justify-center gap-4 mb-4 w-full max-w-sm">
              <div className="flex-1 text-left">
                <h3 className="font-semibold mb-2 text-base sm:text-lg text-white">New to learning?</h3>
                <p className="text-[0.7rem] sm:text-xs leading-relaxed text-white/95 mb-3">
                  Join thousands of learners worldwide. Access expert-led courses, interactive lessons, and
                  earn certificates to advance your career. Start your learning journey today!
                </p>
                <button
                  type="button"
                  onClick={() => setIsSignUpMode(true)}
                  disabled={signInLoading || signUpLoading}
                  className={[
                    "font-poppins border-2 border-white bg-transparent hover:bg-white hover:text-[#4481eb] rounded-full cursor-pointer text-white uppercase transition-all duration-300 font-semibold px-6 h-9 text-xs",
                    (signInLoading || signUpLoading) ? "opacity-60 pointer-events-none" : "",
                  ].join(" ")}
                >
                  Sign up
                </button>
              </div>

              <img src={registerImage} alt="Register illustration" className="w-28 sm:w-32 flex-shrink-0" />
            </div>
          </div>

          {/* Sign Up Mode - bottom */}
          <div
            className={[
              "absolute bottom-0 left-0 w-full z-[13]",
              "flex flex-col items-center justify-end text-center",
              "px-8 pb-8 pt-4",
              "transition-all duration-[1200ms] ease-in-out pointer-events-auto",
              isSignUpMode ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-20",
            ].join(" ")}
          >
            <div className="flex items-end justify-center gap-4 mb-4 w-full max-w-sm">
              <div className="flex-1 text-left">
                <h3 className="font-semibold mb-2 text-base sm:text-lg text-white">Already enrolled?</h3>
                <p className="text-[0.7rem] sm:text-xs leading-relaxed text-white/95 mb-3">
                  Welcome back! Continue your learning journey, track your progress, and access your enrolled
                  courses. Sign in to pick up right where you left off.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSignUpMode(false)}
                  disabled={signInLoading || signUpLoading}
                  className={[
                    "font-poppins border-2 border-white bg-transparent hover:bg-white hover:text-[#4481eb] rounded-full cursor-pointer text-white uppercase transition-all duration-300 font-semibold px-6 h-9 text-xs",
                    (signInLoading || signUpLoading) ? "opacity-60 pointer-events-none" : "",
                  ].join(" ")}
                >
                  Sign in
                </button>
              </div>

              <img src={loginImage} alt="Login illustration" className="w-28 sm:w-32 flex-shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
