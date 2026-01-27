import { api } from "@/lib/api";

export type Permission = {
  id: string;
  permission: string;
};

export type GetPermissionsRes = {
  permissions: Permission[];
};

export async function getPermissionsApi(): Promise<Permission[]> {
  const res = await api.post<GetPermissionsRes>("/api/v1/permission/get-all");
  const data = res?.data;

  if (data?.permissions && Array.isArray(data.permissions)) {
    return data.permissions;
  }

  return [];
}
