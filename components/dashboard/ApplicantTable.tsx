"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Applicant, ApplicantStatus } from "@/lib/types";

interface ApplicantTableProps {
  applicants: Applicant[];
}

type SortColumn = "fullName" | "track" | "status" | "applicationDate";

const STATUS_VARIANT: Record<ApplicantStatus, "pending" | "reviewed" | "accepted" | "rejected"> = {
  pending: "pending",
  shortlisted: "reviewed",
  accepted: "accepted",
  rejected: "rejected",
};

const STATUS_LABEL: Record<ApplicantStatus, string> = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  accepted: "Accepted",
  rejected: "Rejected",
};

function SortIcon({ column, current, dir }: { column: string; current: string; dir: string }) {
  if (current !== column) return <ArrowUpDown className="h-4 w-4 opacity-40" />;
  return dir === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
}

export function ApplicantTable({ applicants }: ApplicantTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortBy = searchParams.get("sortBy") ?? "";
  const sortDir = searchParams.get("sortDir") ?? "asc";

  const handleSort = (col: SortColumn) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortBy === col) {
      params.set("sortDir", sortDir === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", col);
      params.set("sortDir", "asc");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch { return iso; }
  };

  const rowClass = "border-b last:border-0 hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:bg-muted/50";

  return (
    <>
      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {applicants.map((a) => (
          <div
            key={a.id}
            className="rounded-md border bg-card p-4 cursor-pointer hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            onClick={() => router.push(`/applicants/${a.id}`)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${a.fullName}`}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push(`/applicants/${a.id}`); } }}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">{a.fullName}</p>
                <p className="text-sm text-muted-foreground">{a.email}</p>
              </div>
              <Badge variant={STATUS_VARIANT[a.status]}>{STATUS_LABEL[a.status]}</Badge>
            </div>
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span className="capitalize">{a.track}</span>
              <span>|</span>
              <span>{formatDate(a.applicationDate)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-md border">
        <table className="w-full text-sm" aria-label="Applicants list">
          <thead>
            <tr className="border-b bg-muted/50">
              {([
                { key: "fullName", label: "Name" },
                { key: "track", label: "Track" },
                { key: "status", label: "Status" },
                { key: "applicationDate", label: "Applied" },
              ] as { key: SortColumn; label: string }[]).map(({ key, label }) => (
                <th key={key} className="px-4 py-3 text-left font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 gap-1 font-medium"
                    onClick={() => handleSort(key)}
                    aria-label={`Sort by ${label}`}
                  >
                    {label}
                    <SortIcon column={key} current={sortBy} dir={sortDir} />
                  </Button>
                </th>
              ))}
              <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Email</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Country</th>
              <th className="px-4 py-3"><span className="sr-only">View</span></th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a) => (
              <tr
                key={a.id}
                className={rowClass}
                onClick={() => router.push(`/applicants/${a.id}`)}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${a.fullName}`}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); router.push(`/applicants/${a.id}`); } }}
              >
                <td className="px-4 py-3 font-medium text-foreground">{a.fullName}</td>
                <td className="px-4 py-3 text-muted-foreground capitalize">{a.track}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[a.status]}>{STATUS_LABEL[a.status]}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(a.applicationDate)}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{a.email}</td>
                <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{a.country}</td>
                <td className="px-4 py-3 text-right">
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
