"use client";
import { AlertCircle, RefreshCw, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useStatistics } from "@/lib/hooks/useStatistics";

const STATUS_CONFIG = [
  { key: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700" },
  { key: "shortlisted", label: "Shortlisted", color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700" },
  { key: "accepted", label: "Accepted", color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700" },
  { key: "rejected", label: "Rejected", color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700" },
] as const;

export function StatisticsPanel() {
  const { data, isLoading, isError, refetch } = useStatistics();

  if (isLoading) {
    return (
      <div aria-busy="true" aria-label="Loading statistics" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2"><Skeleton className="h-4 w-20" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-12" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div role="alert" className="flex items-center gap-3 rounded-md border border-destructive/20 bg-destructive/10 p-4">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
        <p className="text-sm text-destructive flex-1">Failed to load statistics.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1 shrink-0">
          <RefreshCw className="h-3 w-3" /> Retry
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" aria-label="Application statistics">
      <Card className="col-span-2 sm:col-span-1">
        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{data.total}</p>
          <p className="text-xs text-muted-foreground mt-1">applicants</p>
        </CardContent>
      </Card>

      {STATUS_CONFIG.map(({ key, label, color }) => {
        const count = data.byStatus[key] ?? 0;
        const pct = data.total > 0 ? Math.round((count / data.total) * 100) : 0;
        return (
          <Card key={key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{count}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs border ${color}`}>
                {pct}%
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
