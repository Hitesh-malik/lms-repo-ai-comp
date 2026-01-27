import { useQuery } from "@tanstack/react-query";
import {
  getAllRoleAndPermissionApi,
  getRoleByIdApi,
} from "@/services/roleAndPermissionApi";

export const roleAndPermissionKeys = {
  all: ["roleAndPermission"] as const,
  list: () => [...roleAndPermissionKeys.all, "list"] as const,
  detail: (id: string) => [...roleAndPermissionKeys.all, "detail", id] as const,
};

export function useRoleAndPermissionQuery() {
  return useQuery({
    queryKey: roleAndPermissionKeys.list(),
    queryFn: getAllRoleAndPermissionApi,
    staleTime: 60_000, // 1 min caching (tune as needed)
  });
}

export function useGetRoleQuery(roleId: string | null) {
  return useQuery({
    queryKey: roleAndPermissionKeys.detail(roleId || ""),
    queryFn: () => getRoleByIdApi(roleId!),
    enabled: !!roleId,
    staleTime: 60_000,
  });
}