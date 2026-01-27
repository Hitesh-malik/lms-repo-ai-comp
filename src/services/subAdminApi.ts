import { api } from "@/lib/api";

export type SubAdmin = {
  id: string;
  name: string;
  email: string;
  // add other fields your backend returns
};

export type GetAllSubAdminsRes = SubAdmin[];

export async function getAllSubAdminsApi(): Promise<GetAllSubAdminsRes> {
  const res = await api.get<GetAllSubAdminsRes>("/api/v1/role/get-all-sub-admin");
  return res.data;
}

// Add Sub Admin
export type AddSubAdminReq = {
  username: string;
  password: string;
  name: string;
};

export type AddSubAdminRes = {
  success: boolean;
  detail: string;
};

export async function addSubAdminApi(payload: AddSubAdminReq): Promise<AddSubAdminRes> {
  console.log("payload", payload);
  const res = await api.post<AddSubAdminRes>("/api/v1/role/add-sub-admin", payload);
  return res.data;
}

// Delete Sub Admin
export type DeleteSubAdminRes = {
  success?: boolean;
  detail?: string;
} | null;

export async function deleteSubAdminApi(user_id: string): Promise<DeleteSubAdminRes> {
  const res = await api.post<DeleteSubAdminRes>(`/api/v1/role/delete-sub-admin/${user_id}`);
  return res.data;
}