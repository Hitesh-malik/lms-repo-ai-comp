"use client";

import AuthForm from "@/components/auth/AuthForm";
import { useLoginMutation, useSignupMutation } from "@/hooks/useAuthMutations";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  const login = useLoginMutation();
  const signup = useSignupMutation();

  return (
    <>
      <AuthForm
        onSignIn={(data) =>
          login.mutate(data, {
            onSuccess: () => router.push("/adminDashboard"),
          })
        }
        onSignUp={(data) =>
          signup.mutate(data, {
            onSuccess: () => {
              // optional: after signup, switch to login page or auto-login
              // router.push("/(auth)/auth");
            },
          })
        }
      />

      {/* Optional minimal UI feedback (no layout change) */}
      {login.isPending && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm">
          Logging in...
        </div>
      )}

      {login.isError && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm">
          Login failed. Check username/password.
        </div>
      )}
    </>
  );
}
