"use client";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, RefreshCw, Calendar, Mail, Briefcase, User, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusUpdateControl } from "./StatusUpdateControl";
import { useApplicant } from "@/lib/hooks/useApplicant";
import type { ApplicantStatus } from "@/lib/types";

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

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch { return iso; }
}

export function ApplicantDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: applicant, isLoading, isError, refetch } = useApplicant(id);

  if (isLoading) {
    return (
      <div aria-busy="true" className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="pt-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-5 w-full max-w-sm" />)}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !applicant) {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 rounded-md border border-destructive/20 bg-destructive/10 p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <div>
          <p className="font-semibold text-destructive">Failed to load applicant</p>
          <p className="text-sm text-muted-foreground mt-1">Could not fetch applicant details.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go back
          </Button>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="gap-2 -ml-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" /> Back to list
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{applicant.fullName}</h1>
          <p className="text-muted-foreground capitalize">{applicant.track}</p>
        </div>
        <Badge variant={STATUS_VARIANT[applicant.status]} className="text-sm px-3 py-1 self-start sm:self-auto">
          {STATUS_LABEL[applicant.status]}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Applicant Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Full name</p>
              <p className="font-medium">{applicant.fullName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <a href={`mailto:${applicant.email}`} className="font-medium text-primary hover:underline">
                {applicant.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Track</p>
              <p className="font-medium capitalize">{applicant.track}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Applied</p>
              <p className="font-medium">{formatDate(applicant.applicationDate)}</p>
            </div>
          </div>

          {applicant.country && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Country</p>
                <p className="font-medium">{applicant.country}</p>
              </div>
            </div>
          )}

          {applicant.phoneNumber && (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">{applicant.phoneNumber}</p>
              </div>
            </div>
          )}

          {applicant.experienceLevel && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Experience</p>
              <p className="font-medium capitalize">{applicant.experienceLevel}</p>
            </div>
          )}

          {applicant.skills && applicant.skills.length > 0 && (
            <div className="flex flex-col gap-1 sm:col-span-2">
              <p className="text-xs text-muted-foreground">Skills</p>
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {applicant.motivation && (
            <div className="flex flex-col gap-1 sm:col-span-2">
              <p className="text-xs text-muted-foreground">Motivation</p>
              <p className="text-sm text-foreground">{applicant.motivation}</p>
            </div>
          )}

          {applicant.portfolioUrl && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Portfolio</p>
              <a href={applicant.portfolioUrl} target="_blank" rel="noopener noreferrer"
                className="text-sm text-primary hover:underline truncate">
                {applicant.portfolioUrl}
              </a>
            </div>
          )}

          {applicant.githubUrl && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">GitHub</p>
              <a href={applicant.githubUrl} target="_blank" rel="noopener noreferrer"
                className="text-sm text-primary hover:underline truncate">
                {applicant.githubUrl}
              </a>
            </div>
          )}

          {applicant.notes && (
            <div className="flex flex-col gap-1 sm:col-span-2">
              <p className="text-xs text-muted-foreground">Notes</p>
              <p className="text-sm bg-muted border rounded p-2">{applicant.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update Status</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusUpdateControl applicantId={applicant.id} currentStatus={applicant.status} />
        </CardContent>
      </Card>
    </div>
  );
}
