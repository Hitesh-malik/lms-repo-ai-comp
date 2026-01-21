import { useMutation } from "@tanstack/react-query";
import { loginApi, signupApi, LoginReq, SignupReq } from "@/services/authApi";
import { tokenStore } from "@/lib/token";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginReq) => loginApi(payload),
    onSuccess: (data) => {
      if (data?.access_token) tokenStore.set(data.access_token);
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: (payload: SignupReq) => signupApi(payload),
  });
}
