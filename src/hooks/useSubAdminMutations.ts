import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSubAdminApi, AddSubAdminReq, deleteSubAdminApi } from "@/services/subAdminApi";
import { subAdminKeys } from "./useSubAdminQueries";

export function useAddSubAdminMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddSubAdminReq) => addSubAdminApi(payload),
    onSuccess: () => {
      // Invalidate and refetch sub-admins list after successful creation
      queryClient.invalidateQueries({ queryKey: subAdminKeys.all });
    },
  });
}

export function useDeleteSubAdminMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user_id: string) => deleteSubAdminApi(user_id),
    onSuccess: () => {
      // Invalidate and refetch sub-admins list after successful deletion
      queryClient.invalidateQueries({ queryKey: subAdminKeys.all });
    },
  });
}
 