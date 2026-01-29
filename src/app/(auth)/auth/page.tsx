"use client";

import AuthForm from "@/components/auth/AuthForm";
import { useLoginMutation, useSignupMutation } from "@/hooks/useAuthMutations";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthPage() {
  const router = useRouter();

  const login = useLoginMutation();
  const signup = useSignupMutation();

  return (
    <>
      <AuthForm
        signInLoading={login.isPending}
        signUpLoading={signup.isPending}
        onSignIn={(data) =>
          login.mutate(data, {
            onSuccess: (data) => {
              if(data.success) {
                toast.success(data.detail || "Login successful");
                router.push("/adminDashboard");
              }
            },
            onError: (error) => {
              console.log("error", error);
              toast.error((error as any).response.data.detail || "Login failed");
            },
          })
        }
        onSignUp={(data) =>
          signup.mutate(data, {
            onSuccess: (data) => {
              if(data.success) {
                toast.success(data.detail || "Signup successful");
                router.push("/adminDashboard");
              }
            },
            onError: (error) => {
              console.log("error", error);
              toast.error((error as any).response.data.detail || "Login failed");
            },
          })
        }
      />
    </>
  );
}
