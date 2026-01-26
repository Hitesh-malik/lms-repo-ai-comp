import { api } from "@/lib/api";

export type Role = {
  id: string;
  name: string;
};

export type GetAllRoleAndPermissionRes = Role[] | { roles: Role[] } | null;

export async function getAllRoleAndPermissionApi(): Promise<Role[]> {
  const res = await api.get<GetAllRoleAndPermissionRes>("/api/v1/role/get-all");
  const data = res?.data;
  
  // Handle both array response and object with roles property
  if (Array.isArray(data)) {
    return data;
  }
  
  if (data && typeof data === 'object' && 'roles' in data) {
    const rolesData = data as { roles?: Role[] };
    return rolesData.roles ?? [];
  }
  
  return [];
}

// Assign Role
export type AssignRoleReq = {
  user_id: string;
  role_id: string;
};

export type AssignRoleRes = {
  success?: boolean;
  detail?: string;
};

export async function assignRoleApi(payload: AssignRoleReq): Promise<AssignRoleRes> {
  const res = await api.post<AssignRoleRes>(
    `/api/v1/role/assign-role?user_id=${payload.user_id}&role_id=${payload.role_id}`
  );
  return res.data;
}
