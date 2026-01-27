import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  assignRoleApi,
  AssignRoleReq,
  createRoleApi,
  CreateRoleReq,
  updateRolePermissionApi,
  UpdateRolePermissionReq,
} from "@/services/roleAndPermissionApi";
import { subAdminKeys } from "./useSubAdminQueries";
import { roleAndPermissionKeys } from "./useRolePermissionQueries";

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

export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRoleReq) => createRoleApi(payload),
    onSuccess: () => {
      // Invalidate and refetch roles list after successful creation
      queryClient.invalidateQueries({
        queryKey: roleAndPermissionKeys.all,
      });
    },
  });
}

export function useUpdateRolePermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRolePermissionReq) =>
      updateRolePermissionApi(payload),
    onSuccess: () => {
      // Invalidate and refetch roles list after successful permission update
      queryClient.invalidateQueries({
        queryKey: roleAndPermissionKeys.all,
      });
    },
  });
}
