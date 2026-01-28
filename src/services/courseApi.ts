import { api } from "@/lib/api";

export type Course = {
  id: string;
  slug: string;
  thumbnail_key: string | null;
  // full URL for thumbnail image (can be null)
  thumbnail_url?: string | null;
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

// ——— Course thumbnail upload ———
export type GetThumbnailSignedUrlBody = {
  file_type: "image/jpeg" | "image/png" | "image/webp";
};

export type GetThumbnailSignedUrlRes = {
  object_key: string;
  upload_url?: string;
  signed_url?: string;
  url?: string;
  [key: string]: unknown;
};

export async function getCourseThumbnailSignedUrlApi(
  body: GetThumbnailSignedUrlBody
): Promise<GetThumbnailSignedUrlRes> {
  const res = await api.post<GetThumbnailSignedUrlRes>("/api/v1/courses/get-signed-url", body);
  return res.data;
}

export type SaveThumbnailBody = {
  object_key: string;
};

export type SaveThumbnailRes = {
  success: boolean;
  detail: string;
};

export async function saveCourseThumbnailApi(
  slug: string,
  body: SaveThumbnailBody
): Promise<SaveThumbnailRes> {
  const res = await api.post<SaveThumbnailRes>(
    `/api/v1/courses/save-thumbnail/${slug}`,
    body
  );
  return res.data;
}

export async function deleteCourseThumbnailApi(slug: string): Promise<null> {
  const res = await api.delete<null>(`/api/v1/courses/delete-thumbnail/${slug}`);
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

// ——— Update module ———
export type UpdateModuleBody = {
  title?: string | null;
  description?: string | null;
  is_published?: boolean | null;
};

export type UpdateModuleRes = Module;

export async function updateModuleApi(
  moduleId: string,
  body: UpdateModuleBody
): Promise<UpdateModuleRes> {
  const res = await api.put<UpdateModuleRes>(`/api/v1/module/${moduleId}`, body);
  return res.data;
}

// ——— Delete module ———
export async function deleteModuleApi(moduleId: string): Promise<null> {
  const res = await api.delete<null>(`/api/v1/module/${moduleId}`);
  return res.data;
}

// ——— Add lesson ———
export type AddLessonBody = {
  title: string;
  description?: string | null;
  content_type: "video" | "quiz" | "live";
  order_index: number;
};

export type AddLessonRes = {
  success: boolean;
  detail: string;
  lesson: Lesson;
};

export async function addLessonApi(moduleId: string, body: AddLessonBody): Promise<AddLessonRes> {
  const res = await api.post<AddLessonRes>(`/api/v1/lesson/${moduleId}`, body);
  return res.data;
}

// ——— Update lesson ———
export type UpdateLessonBody = {
  title?: string | null;
  description?: string | null;
  is_published?: boolean | null;
  is_free_preview?: boolean | null;
};

export type UpdateLessonRes = Lesson;

export async function updateLessonApi(
  lessonId: string,
  body: UpdateLessonBody
): Promise<UpdateLessonRes> {
  const res = await api.put<UpdateLessonRes>(`/api/v1/lesson/${lessonId}`, body);
  return res.data;
}

// ——— Delete lesson ———
export async function deleteLessonApi(lessonId: string): Promise<null> {
  const res = await api.delete<null>(`/api/v1/lesson/${lessonId}`);
  return res.data;
}
