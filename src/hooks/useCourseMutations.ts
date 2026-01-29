import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCourseApi,
  CreateCourseBody,
  deleteCourseApi,
  addModuleApi,
  AddModuleBody,
  updateModuleApi,
  UpdateModuleBody,
  deleteModuleApi,
  addLessonApi,
  AddLessonBody,
  updateLessonApi,
  UpdateLessonBody,
  deleteLessonApi,
  getCourseThumbnailSignedUrlApi,
  saveCourseThumbnailApi,
  deleteCourseThumbnailApi,
  UpdateCourseBody,
  updateCourseApi,
} from "@/services/courseApi";
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

export function useUpdateCourseMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateCourseBody) => updateCourseApi(slug, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}

export function useAddModuleMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AddModuleBody) => addModuleApi(slug, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.contentAdmin(slug) });
    },
  });
}

export function useUpdateModuleMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, body }: { moduleId: string; body: UpdateModuleBody }) =>
      updateModuleApi(moduleId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.contentAdmin(slug) });
    },
  });
}

export function useDeleteModuleMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moduleId: string) => deleteModuleApi(moduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.contentAdmin(slug) });
    },
  });
}

export function useAddLessonMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moduleId, body }: { moduleId: string; body: AddLessonBody }) =>
      addLessonApi(moduleId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.contentAdmin(slug) });
    },
  });
}

export function useUpdateLessonMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId, body }: { lessonId: string; body: UpdateLessonBody }) =>
      updateLessonApi(lessonId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.contentAdmin(slug) });
    },
  });
}

export function useDeleteLessonMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: string) => deleteLessonApi(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.contentAdmin(slug) });
    },
  });
}

export function useUpdateCourseThumbnailMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (object_key: string) => {
      return saveCourseThumbnailApi(slug, { object_key });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.admin() });
      queryClient.invalidateQueries({ queryKey: courseKeys.contentAdmin(slug) });
    },
  });
}

export function useDeleteCourseThumbnailMutation(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteCourseThumbnailApi(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.admin() });
      queryClient.invalidateQueries({ queryKey: courseKeys.contentAdmin(slug) });
    },
  });
}
