"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, InboxIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicantFilters } from "./ApplicantFilters";
import { ApplicantTable } from "./ApplicantTable";
import { ApplicantPagination } from "./ApplicantPagination";
import { useApplicants } from "@/lib/hooks/useApplicants";
import type { ApplicantQueryParams, ApplicantStatus } from "@/lib/types";

function ApplicantListInner() {
  const searchParams = useSearchParams();

  const params: ApplicantQueryParams = {
    q: searchParams.get("q") || undefined,
    status: (searchParams.get("status") as ApplicantStatus) || undefined,
    sortBy: (searchParams.get("sortBy") as ApplicantQueryParams["sortBy"]) || undefined,
    sortDir: (searchParams.get("sortDir") as "asc" | "desc") || undefined,
    page: Number(searchParams.get("page") ?? "1"),
    pageSize: Number(searchParams.get("pageSize") ?? "10"),
  };

  const { data, isLoading, isError, refetch } = useApplicants(params);
  const hasFilters = !!(params.q || params.status);

  return (
    <div className="space-y-4">
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <ApplicantFilters />
      </Suspense>

      {isLoading && (
        <div aria-busy="true" aria-label="Loading applicants">
          <div className="rounded-md border overflow-hidden">
            <div className="border-b bg-muted/50 px-4 py-3">
              <Skeleton className="h-4 w-48" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-b last:border-0 px-4 py-3 flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      )}

      {isError && !isLoading && (
        <div role="alert" className="flex flex-col items-center gap-4 rounded-md border border-destructive/20 bg-destructive/10 p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">Failed to load applicants</p>
            <p className="text-sm text-muted-foreground mt-1">Something went wrong while fetching data.</p>
          </div>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </div>
      )}

      {!isLoading && !isError && data && data.data.length === 0 && (
        <div role="status" className="flex flex-col items-center gap-4 rounded-md border border-dashed p-8 text-center">
          <InboxIcon className="h-8 w-8 text-muted-foreground" />
          <div>
            <p className="font-semibold">{hasFilters ? "No matching applicants" : "No applicants yet"}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {hasFilters ? "Try adjusting your search or filters." : "There are no applicants in the system."}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && data && data.data.length > 0 && (
        <>
          <ApplicantTable applicants={data.data} />
          <ApplicantPagination
            page={data.meta?.page ?? data.page ?? 1}
            totalPages={data.meta?.totalPages ?? data.totalPages ?? 1}
            total={data.meta?.total ?? data.total ?? 0}
            pageSize={data.meta?.limit ?? data.pageSize ?? 10}
          />
        </>
      )}
    </div>
  );
}

export function ApplicantList() {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    }>
      <ApplicantListInner />
    </Suspense>
  );
}
