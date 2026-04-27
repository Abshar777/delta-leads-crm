"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types";

export interface CallLog {
  id:           string;
  startTime:    string;
  duration:     number;       // seconds
  direction:    "inbound" | "outbound";
  status:       string;       // "answered" | "no-answer" | "busy" | etc.
  callerNumber: string;
  calleeNumber: string;
  agentName:    string | null;
  recordingUrl: string | null;
}

interface CallsResponse {
  calls: CallLog[];
  phone: string;
  total: number;
  hint?: string;
}

export const useLeadCalls = (leadId: string, enabled = true) =>
  useQuery({
    queryKey: ["calls", leadId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<CallsResponse>>(`/calls/lead/${leadId}`);
      return res.data.data ?? { calls: [], phone: "", total: 0 };
    },
    enabled: !!leadId && enabled,
    staleTime: 60_000,   // cache 1 min — call logs don't change that fast
    refetchOnWindowFocus: false,
  });

/** Format seconds → "2m 34s" or "45s" */
export function fmtDuration(seconds: number): string {
  if (!seconds || seconds < 1) return "0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

/** Format ISO to readable date+time IST */
export function fmtCallTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}
