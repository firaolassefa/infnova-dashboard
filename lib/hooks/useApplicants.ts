import { useQuery } from "@tanstack/react-query";
import { getApplicants } from "@/lib/api/applicants";
import type { ApplicantQueryParams } from "@/lib/types";

export const APPLICANTS_QUERY_KEY = "applicants";

export function useApplicants(params: ApplicantQueryParams) {
  return useQuery({
    queryKey: [APPLICANTS_QUERY_KEY, params],
    queryFn: () => getApplicants(params),
    placeholderData: (prev) => prev,
  });
}
