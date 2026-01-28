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

// ——— Course content (admin) ———
export type Lesson = {
  id: string;
  module_id: string;
  content_id: string | null;
  content_type: string;
  content_uploaded: boolean;
  title: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
  is_free_preview: boolean;
  created_at: string;
  updated_at: string;
};

export type Module = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
};

export type GetCourseContentAdminRes = {
  course: Course;
  modules: Module[];
};

export async function getCourseContentAdminApi(slug: string): Promise<GetCourseContentAdminRes> {
  const res = await api.get<GetCourseContentAdminRes>(`/api/v1/courses/admin/content/${slug}`);
  return res.data;
}

// ——— Add module ———
export type AddModuleBody = {
  title: string;
  description?: string | null;
  order_index: number;
};

export type AddModuleRes = {
  success: boolean;
  detail: string;
  module: Module;
};

export async function addModuleApi(slug: string, body: AddModuleBody): Promise<AddModuleRes> {
  const res = await api.post<AddModuleRes>(`/api/v1/module/${slug}`, body);
  return res.data;
}
