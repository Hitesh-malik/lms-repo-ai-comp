import { api } from "@/lib/api";

export type Course = {
  id: string;
  slug: string;
  thumbnail_key: string | null;
  title: string;
  type: string;
  is_published: boolean;
  updated_at: string;
  description: string | null;
  price: number | null;
  language: string;
  created_at: string;
};

export type GetCoursesAdminRes = Course[];

export async function getCoursesAdminApi(): Promise<GetCoursesAdminRes> {
  const res = await api.get<GetCoursesAdminRes>("/api/v1/courses/admin");
  return res.data;
}

export type DeleteCourseRes = Record<string, unknown> | null;

export async function deleteCourseApi(slug: string): Promise<DeleteCourseRes> {
  const res = await api.delete<DeleteCourseRes>(`/api/v1/courses/${slug}`);
  return res.data;
}

export type CreateCourseBody = {
  title: string;
  slug: string;
  description?: string | null;
  language?: string | null;
  price?: number | null;
  type?: string | null;
};

export type CreateCourseRes = Course;

export async function createCourseApi(body: CreateCourseBody): Promise<CreateCourseRes> {
  const res = await api.post<CreateCourseRes>("/api/v1/courses", body);
  return res.data;
}
