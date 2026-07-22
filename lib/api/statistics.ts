import apiClient from "./client";
import type { Statistics } from "@/lib/types";

interface RawDashboardSummary {
  totalApplicants: number;
  byStatus: Record<string, number>;
  byTrack: Record<string, number>;
}

export async function getStatistics(): Promise<Statistics> {
  const { data } = await apiClient.get<RawDashboardSummary>("/dashboard/summary");
  return {
    total: data.totalApplicants,
    byStatus: data.byStatus as Statistics["byStatus"],
  };
}
