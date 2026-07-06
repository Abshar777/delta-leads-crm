import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type {
  OverviewReport,
  TimelinePoint,
  UserRankItem,
  TeamRankItem,
  TimelinePeriod,
  TeamSplitReport,
  SplitPeriod,
  RevenuePeriod,
  RevenueOverview,
  RevenueTimelineReport,
  RevenueTeamDetail,
  SourceAnalyticsItem,
  CampaignBreakdownItem,
} from "@/types/reports";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// ── Overview ─────────────────────────────────────────────────────────────────

export function useReportOverview(dateFrom: string, dateTo: string) {
  return useQuery<OverviewReport>({
    queryKey: ["reports", "overview", dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo)   params.set("dateTo",   dateTo);
      const { data } = await api.get<ApiResponse<OverviewReport>>(
        `/reports/overview?${params}`,
      );
      return data.data;
    },
    staleTime: 60_000,
  });
}

// ── Timeline ─────────────────────────────────────────────────────────────────

export function useReportTimeline(
  period: TimelinePeriod,
  dateFrom: string,
  dateTo: string,
) {
  return useQuery<TimelinePoint[]>({
    queryKey: ["reports", "timeline", period, dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams({ period });
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo)   params.set("dateTo",   dateTo);
      const { data } = await api.get<ApiResponse<TimelinePoint[]>>(
        `/reports/timeline?${params}`,
      );
      return data.data;
    },
    staleTime: 60_000,
  });
}

// ── User Rankings ─────────────────────────────────────────────────────────────

export function useReportUserRankings(dateFrom: string, dateTo: string) {
  return useQuery<UserRankItem[]>({
    queryKey: ["reports", "users", dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "20" });
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo)   params.set("dateTo",   dateTo);
      const { data } = await api.get<ApiResponse<UserRankItem[]>>(
        `/reports/users?${params}`,
      );
      return data.data;
    },
    staleTime: 60_000,
  });
}

// ── Team Rankings ─────────────────────────────────────────────────────────────

export function useReportTeamRankings(dateFrom: string, dateTo: string) {
  return useQuery<TeamRankItem[]>({
    queryKey: ["reports", "teams", dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo)   params.set("dateTo",   dateTo);
      const { data } = await api.get<ApiResponse<TeamRankItem[]>>(
        `/reports/teams?${params}`,
      );
      return data.data;
    },
    staleTime: 60_000,
  });
}

// ── Team Split ────────────────────────────────────────────────────────────────

export function useReportTeamSplit(
  period: SplitPeriod,
  dateFrom: string,
  dateTo: string,
) {
  return useQuery<TeamSplitReport>({
    queryKey: ["reports", "team-split", period, dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams({ period });
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo)   params.set("dateTo",   dateTo);
      const { data } = await api.get<ApiResponse<TeamSplitReport>>(
        `/reports/team-split?${params}`,
      );
      return data.data;
    },
    staleTime: 60_000,
  });
}

// ── Revenue Overview ──────────────────────────────────────────────────────────

export function useRevenueOverview(dateFrom: string, dateTo: string) {
  return useQuery<RevenueOverview>({
    queryKey: ["reports", "revenue", "overview", dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo)   params.set("dateTo",   dateTo);
      const { data } = await api.get<ApiResponse<RevenueOverview>>(
        `/reports/revenue/overview?${params}`,
      );
      return data.data;
    },
    staleTime: 60_000,
  });
}

// ── Revenue Timeline ──────────────────────────────────────────────────────────

export function useRevenueTimeline(
  period: RevenuePeriod,
  dateFrom: string,
  dateTo: string,
) {
  return useQuery<RevenueTimelineReport>({
    queryKey: ["reports", "revenue", "timeline", period, dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams({ period });
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo)   params.set("dateTo",   dateTo);
      const { data } = await api.get<ApiResponse<RevenueTimelineReport>>(
        `/reports/revenue/timeline?${params}`,
      );
      return data.data;
    },
    staleTime: 60_000,
  });
}

// ── Source Analytics ──────────────────────────────────────────────────────────

export function useSourceAnalytics(dateFrom: string, dateTo: string, teamId?: string) {
  return useQuery<SourceAnalyticsItem[]>({
    queryKey: ["reports", "sources", dateFrom, dateTo, teamId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo)   params.set("dateTo",   dateTo);
      if (teamId)   params.set("team",     teamId);
      const { data } = await api.get<ApiResponse<SourceAnalyticsItem[]>>(
        `/reports/sources?${params}`,
      );
      return data.data;
    },
    staleTime: 60_000,
  });
}

export function useCampaignBreakdown(source: string, dateFrom: string, dateTo: string) {
  return useQuery<CampaignBreakdownItem[]>({
    queryKey: ["reports", "sources", source, "campaigns", dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo)   params.set("dateTo",   dateTo);
      const { data } = await api.get<ApiResponse<CampaignBreakdownItem[]>>(
        `/reports/sources/${encodeURIComponent(source)}/campaigns?${params}`,
      );
      return data.data;
    },
    enabled: !!source,
    staleTime: 60_000,
  });
}

// ── Revenue Teams (with member breakdown) ─────────────────────────────────────

export function useRevenueTeams(dateFrom: string, dateTo: string) {
  return useQuery<RevenueTeamDetail[]>({
    queryKey: ["reports", "revenue", "teams", dateFrom, dateTo],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo)   params.set("dateTo",   dateTo);
      const { data } = await api.get<ApiResponse<RevenueTeamDetail[]>>(
        `/reports/revenue/teams?${params}`,
      );
      return data.data;
    },
    staleTime: 60_000,
  });
}

// ── Response Time SLA ──────────────────────────────────────────────────────────

export interface ResponseTimeAgent {
  agentId: string;
  agentName: string;
  agentEmail?: string;
  totalAssigned: number;
  totalContacted: number;
  totalWithinSla: number;
  slaComplianceRate: number;
  avgResponseMinutes: number | null;
  minResponseMinutes: number | null;
  maxResponseMinutes: number | null;
  notContactedCount: number;
}

export interface ResponseTimeBreachedLead {
  _id: string;
  name: string;
  phone: string;
  source?: string;
  status: string;
  assignedAt: string;
  assignedTo?: { _id: string; name: string; email: string };
  course?: { _id: string; name: string };
  minutesSinceAssign: number | null;
}

export interface ResponseTimeReport {
  summary: {
    slaMinutes: number;
    totalAssigned: number;
    totalContacted: number;
    notContacted: number;
    totalWithinSla: number;
    overallSlaRate: number;
    overallAvgResponseMinutes: number;
  };
  agentRanking: ResponseTimeAgent[];
  breachedLeads: ResponseTimeBreachedLead[];
}

export function useResponseTimeReport(params: {
  teamId?: string;
  dateFrom?: string;
  dateTo?: string;
  slaMinutes?: number;
}) {
  const { teamId, dateFrom, dateTo, slaMinutes } = params;
  return useQuery<ResponseTimeReport>({
    queryKey: ["reports", "response-time", teamId, dateFrom, dateTo, slaMinutes],
    queryFn: async () => {
      const p = new URLSearchParams();
      if (teamId)     p.set("teamId", teamId);
      if (dateFrom)   p.set("dateFrom", dateFrom);
      if (dateTo)     p.set("dateTo", dateTo);
      if (slaMinutes) p.set("slaMinutes", String(slaMinutes));
      const { data } = await api.get<ApiResponse<ResponseTimeReport>>(`/reports/response-time?${p}`);
      return data.data as ResponseTimeReport;
    },
    staleTime: 60_000,
  });
}

// ── Follow-Up Report ───────────────────────────────────────────────────────────

export interface FollowUpAgentRank {
  agentId: string;
  agentName: string;
  agentEmail?: string;
  totalFollowUps: number;
  uniqueLeads: number;
  lastFollowUp?: string;
}

export interface FollowUpLeadBreakdown {
  _id: string;
  name: string;
  phone: string;
  status: string;
  source?: string;
  nextFollowUpAt?: string | null;
  followUpCount: number;
  totalFollowUpsAllTime: number;
  lastFollowUpAt?: string;
  agentName: string;
  agentEmail?: string;
}

export interface FollowUpOverdueLead {
  _id: string;
  name: string;
  phone: string;
  source?: string;
  status: string;
  nextFollowUpAt: string;
  assignedTo?: { _id: string; name: string; email: string };
  course?: { _id: string; name: string };
  overdueByMinutes: number | null;
  totalFollowUps: number;
}

export interface FollowUpReport {
  summary: {
    totalFollowUps: number;
    totalAgentsTracked: number;
    overdueCount: number;
    leadsWithFollowUps: number;
  };
  agentRanking: FollowUpAgentRank[];
  leadBreakdown: FollowUpLeadBreakdown[];
  overdueLeads: FollowUpOverdueLead[];
}

export function useFollowUpReport(params: {
  teamId?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const { teamId, dateFrom, dateTo } = params;
  return useQuery<FollowUpReport>({
    queryKey: ["reports", "followups", teamId, dateFrom, dateTo],
    queryFn: async () => {
      const p = new URLSearchParams();
      if (teamId)   p.set("teamId",   teamId);
      if (dateFrom) p.set("dateFrom", dateFrom);
      if (dateTo)   p.set("dateTo",   dateTo);
      const { data } = await api.get<ApiResponse<FollowUpReport>>(`/reports/followups?${p}`);
      return data.data as FollowUpReport;
    },
    staleTime: 60_000,
  });
}

// ── Pipeline Breakdown ─────────────────────────────────────────────────────────

export interface PipelineStage {
  key: string;
  label: string;
  count: number;
  pct: number;
  color: string;
}

export interface PipelineTrendPoint {
  month: string;
  total: number;
  contacted: number;
  followUp: number;
  interested: number;
  notInterested: number;
  lost: number;
  converted: number;
}

export interface PipelineBreakdown {
  total: number;
  stages: PipelineStage[];
  trend: PipelineTrendPoint[];
}

export function usePipelineBreakdown(params: {
  teamId?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  const { teamId, dateFrom, dateTo } = params;
  return useQuery<PipelineBreakdown>({
    queryKey: ["reports", "pipeline", teamId, dateFrom, dateTo],
    queryFn: async () => {
      const p = new URLSearchParams();
      if (teamId)   p.set("teamId",   teamId);
      if (dateFrom) p.set("dateFrom", dateFrom);
      if (dateTo)   p.set("dateTo",   dateTo);
      const { data } = await api.get<ApiResponse<PipelineBreakdown>>(`/reports/pipeline?${p}`);
      return data.data as PipelineBreakdown;
    },
    staleTime: 60_000,
  });
}
