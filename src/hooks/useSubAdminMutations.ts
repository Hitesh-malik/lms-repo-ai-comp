import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSubAdminApi, AddSubAdminReq } from "@/services/subAdminApi";
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
 