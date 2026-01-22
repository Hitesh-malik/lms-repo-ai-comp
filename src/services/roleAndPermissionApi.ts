import { api } from "@/lib/api";

export type Role = {
  id: string;
  name: string;
};

export type GetAllRoleAndPermissionRes = Role[];

export async function getAllRoleAndPermissionApi(): Promise<GetAllRoleAndPermissionRes> {
  const res = await api.get<GetAllRoleAndPermissionRes>("/api/v1/role/get-all");
  console.log("res", res);
  return res?.data?.roles ?? [];
}
