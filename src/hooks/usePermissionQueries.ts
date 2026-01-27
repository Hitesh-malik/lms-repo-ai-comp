import { useQuery } from "@tanstack/react-query";
import { getPermissionsApi } from "@/services/permissionApi";

export const permissionKeys = {
  all: ["permissions"] as const,
  list: () => [...permissionKeys.all, "list"] as const,
};

export function usePermissionsQuery() {
  return useQuery({
    queryKey: permissionKeys.list(),
    queryFn: getPermissionsApi,
    staleTime: 60_000,
  });
}
