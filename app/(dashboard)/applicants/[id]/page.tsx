import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ApplicantDetail } from "@/components/applicant/ApplicantDetail";

interface PageProps {
  params: { id: string };
}

export default function ApplicantDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6" aria-busy="true" aria-label="Loading applicant details">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      }
    >
      <ApplicantDetail id={params.id} />
    </Suspense>
  );
}
