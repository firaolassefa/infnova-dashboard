import { useQuery } from "@tanstack/react-query";
import { getApplicant } from "@/lib/api/applicants";

export const APPLICANT_QUERY_KEY = "applicant";

export function useApplicant(id: string) {
  return useQuery({
    queryKey: [APPLICANT_QUERY_KEY, id],
    queryFn: () => getApplicant(id),
    enabled: !!id,
  });
}
