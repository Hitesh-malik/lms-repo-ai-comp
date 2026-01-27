import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourseApi, CreateCourseBody, deleteCourseApi } from "@/services/courseApi";
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

export function useCreateCourseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCourseBody) => createCourseApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}
