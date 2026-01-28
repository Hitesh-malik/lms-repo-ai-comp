import { useMutation } from "@tanstack/react-query";
import {
  loginApi,
  signupApi,
  LoginReq,
  SignupReq,
  logoutApi,
} from "@/services/authApi";
import { tokenStore } from "@/lib/token";
import { useRouter } from "next/navigation";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginReq) => loginApi(payload),
    onSuccess: (data) => {
      if (data?.access_token) tokenStore.set(data.access_token);
      if(data.refresh_token) tokenStore.setRefresh(data.refresh_token);
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: (payload: SignupReq) => signupApi(payload),
    onSuccess: (data) => {
      if (data?.access_token) tokenStore.set(data.access_token);
      if(data.refresh_token) tokenStore.setRefresh(data.refresh_token);
    },
  });
}

export function useLogoutMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      tokenStore.clear();
      router.push("/auth");
    },
  });
}
