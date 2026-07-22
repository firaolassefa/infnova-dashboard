"use client";
import { Suspense } from "react";
import { StatisticsPanel } from "@/components/dashboard/StatisticsPanel";
import { ApplicantList } from "@/components/dashboard/ApplicantList";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applicant Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage and review internship applications.
        </p>
      </div>

      {/* Statistics */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Summary statistics
        </h2>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-lg" />
              ))}
            </div>
          }
        >
          <StatisticsPanel />
        </Suspense>
      </section>

      {/* Applicant list */}
      <section aria-labelledby="applicants-heading">
        <h2 id="applicants-heading" className="text-lg font-semibold mb-4">
          Applicants
        </h2>
        <Suspense fallback={<Skeleton className="h-64 rounded-lg" />}>
          <ApplicantList />
        </Suspense>
      </section>
    </div>
  );
}
