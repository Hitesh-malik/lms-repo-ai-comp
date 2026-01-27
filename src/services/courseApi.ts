import { api } from "@/lib/api";

export type Course = {
  id: string;
  title: string;
  description?: string;
  is_published?: boolean;
  created_at?: string;
  [key: string]: unknown;
};

export type GetCoursesAdminRes = Course[];

export async function getCoursesAdminApi(): Promise<GetCoursesAdminRes> {
  const res = await api.get<GetCoursesAdminRes>("/api/v1/courses/admin");
  return res.data;
}
