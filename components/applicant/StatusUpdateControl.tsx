"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateApplicantStatus } from "@/lib/api/applicants";
import { APPLICANTS_QUERY_KEY } from "@/lib/hooks/useApplicants";
import { STATISTICS_QUERY_KEY } from "@/lib/hooks/useStatistics";
import { APPLICANT_QUERY_KEY } from "@/lib/hooks/useApplicant";
import { useToast } from "@/lib/hooks/use-toast";
import type { ApplicantStatus } from "@/lib/types";

const STATUSES: { value: ApplicantStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

interface StatusUpdateControlProps {
  applicantId: string;
  currentStatus: ApplicantStatus;
}

export function StatusUpdateControl({ applicantId, currentStatus }: StatusUpdateControlProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selected, setSelected] = useState<ApplicantStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const hasChanged = selected !== currentStatus;

  const handleSubmit = async () => {
    if (!hasChanged) return;
    setIsUpdating(true);
    try {
      await updateApplicantStatus(applicantId, selected);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [APPLICANTS_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [STATISTICS_QUERY_KEY] }),
        queryClient.invalidateQueries({ queryKey: [APPLICANT_QUERY_KEY, applicantId] }),
      ]);
      toast({ title: "Status updated", description: `Status changed to ${selected}.` });
    } catch {
      setSelected(currentStatus);
      toast({ variant: "destructive", title: "Update failed", description: "Could not update status. Please try again." });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="status-select">Status</Label>
      <div className="flex gap-3 flex-wrap">
        <Select value={selected} onValueChange={(v: string) => setSelected(v as ApplicantStatus)} disabled={isUpdating}>
          <SelectTrigger id="status-select" className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit} disabled={!hasChanged || isUpdating} className="gap-2 min-h-[44px]">
          {isUpdating ? (<><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>) : "Save status"}
        </Button>
      </div>
    </div>
  );
}
