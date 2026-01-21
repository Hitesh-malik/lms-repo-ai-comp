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
