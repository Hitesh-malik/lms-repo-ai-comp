import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignRoleApi, AssignRoleReq } from "@/services/roleAndPermissionApi";
import { subAdminKeys } from "./useSubAdminQueries";

export function useAssignRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignRoleReq) => assignRoleApi(payload),
    onSuccess: () => {
      // Invalidate and refetch sub-admins list after successful role assignment
      queryClient.invalidateQueries({ queryKey: subAdminKeys.all });
    },
  });
}
