import { useQuery } from "@tanstack/react-query";
import { getAllSubAdminsApi } from "@/services/subAdminApi";

export const subAdminKeys = {
  all: ["subAdmins"] as const,
  list: () => [...subAdminKeys.all, "list"] as const,
};

export function useSubAdminsQuery() {
  return useQuery({
    queryKey: subAdminKeys.list(),
    queryFn: getAllSubAdminsApi,
    staleTime: 60_000, // 1 min caching (tune as needed)
  });
}
