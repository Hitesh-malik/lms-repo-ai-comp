import { useQuery } from "@tanstack/react-query";
import {
  getCoursesAdminApi,
  getCourseContentAdminApi,
  getLessonAdminApi,
  getQuizAdminApi,
  getQuizQuestionsApi,
} from "@/services/courseApi";

export const courseKeys = {
  all: ["courses"] as const,
  admin: () => [...courseKeys.all, "admin"] as const,
  contentAdmin: (slug: string) => [...courseKeys.all, "content-admin", slug] as const,
  lessonAdmin: (lessonId: string) => [...courseKeys.all, "lesson-admin", lessonId] as const,
  quizAdmin: (quizId: string) => [...courseKeys.all, "quiz-admin", quizId] as const,
  quizQuestions: (quizId: string) => [...courseKeys.all, "quiz-questions", quizId] as const,
};

export function useCoursesAdminQuery() {
  return useQuery({
    queryKey: courseKeys.admin(),
    queryFn: getCoursesAdminApi,
    staleTime: 60_000,
  });
}

export function useCourseContentAdminQuery(slug: string | null) {
  return useQuery({
    queryKey: courseKeys.contentAdmin(slug ?? ""),
    queryFn: () => getCourseContentAdminApi(slug!),
    enabled: !!slug && slug.length > 0,
    staleTime: 30_000,
  });
}

export function useLessonAdminQuery(lessonId: string | null) {
  return useQuery({
    queryKey: courseKeys.lessonAdmin(lessonId ?? ""),
    queryFn: () => getLessonAdminApi(lessonId!),
    enabled: !!lessonId && lessonId.length > 0,
    staleTime: 30_000,
  });
}

export function useQuizAdminQuery(quizId: string | null) {
  return useQuery({
    queryKey: courseKeys.quizAdmin(quizId ?? ""),
    queryFn: () => getQuizAdminApi(quizId!),
    enabled: !!quizId && quizId.length > 0,
    staleTime: 30_000,
  });
}

export function useQuizQuestionsQuery(quizId: string | null) {
  return useQuery({
    queryKey: courseKeys.quizQuestions(quizId ?? ""),
    queryFn: () => getQuizQuestionsApi(quizId!),
    enabled: !!quizId && quizId.length > 0,
    staleTime: 30_000,
  });
}
