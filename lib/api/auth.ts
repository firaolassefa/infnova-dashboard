import apiClient from "./client";
import type { LoginRequest, LoginResponse } from "@/lib/types";

export async function login(req: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", req);
  return data;
}
