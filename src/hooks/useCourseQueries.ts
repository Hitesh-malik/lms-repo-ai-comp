import { useQuery } from "@tanstack/react-query";
import { getCoursesAdminApi } from "@/services/courseApi";

export const courseKeys = {
  all: ["courses"] as const,
  admin: () => [...courseKeys.all, "admin"] as const,
};

export function useCoursesAdminQuery() {
  return useQuery({
    queryKey: courseKeys.admin(),
    queryFn: getCoursesAdminApi,
    staleTime: 60_000,
  });
}
