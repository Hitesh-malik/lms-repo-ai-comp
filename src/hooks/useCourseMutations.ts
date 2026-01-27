import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCourseApi } from "@/services/courseApi";
import { courseKeys } from "./useCourseQueries";

export function useDeleteCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => deleteCourseApi(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}
