import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@/lib/api/statistics";

export const STATISTICS_QUERY_KEY = "statistics";

export function useStatistics() {
  return useQuery({
    queryKey: [STATISTICS_QUERY_KEY],
    queryFn: getStatistics,
  });
}
