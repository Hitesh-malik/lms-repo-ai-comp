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
