import apiClient from "./client";
import type { Applicant, ApplicantListResponse, ApplicantQueryParams, ApplicantStatus } from "@/lib/types";

interface RawPaginatedResponse {
  data: Applicant[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export async function getApplicants(params: ApplicantQueryParams): Promise<ApplicantListResponse> {
  const query: Record<string, string | number> = {};
  if (params.q) query.search = params.q;
  if (params.status) query.status = params.status;
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.sortDir) query.sortOrder = params.sortDir;
  if (params.page) query.page = params.page;
  if (params.pageSize) query.limit = params.pageSize;

  const { data } = await apiClient.get<RawPaginatedResponse>("/applicants", { params: query });

  return {
    data: data.data,
    meta: data.meta,
    total: data.meta.total,
    page: data.meta.page,
    pageSize: data.meta.limit,
    totalPages: data.meta.totalPages,
  };
}

export async function getApplicant(id: string): Promise<Applicant> {
  const { data } = await apiClient.get<Applicant>(`/applicants/${id}`);
  return data;
}

export async function updateApplicantStatus(id: string, status: ApplicantStatus): Promise<Applicant> {
  const { data } = await apiClient.patch<Applicant>(`/applicants/${id}/status`, { status });
  return data;
}
