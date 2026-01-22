import { useQuery } from "@tanstack/react-query";
import { getAllRoleAndPermissionApi } from "@/services/roleAndPermissionApi";

export const roleAndPermissionKeys = {
    all: ["roleAndPermission"] as const,
    list: () => [...roleAndPermissionKeys.all, "list"] as const,
  };

export function useRoleAndPermissionQuery() {
    return useQuery({
        queryKey: roleAndPermissionKeys.list(),
        queryFn: getAllRoleAndPermissionApi,
        staleTime: 60_000, // 1 min caching (tune as needed)
    });
}