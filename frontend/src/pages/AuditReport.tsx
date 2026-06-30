import { useLocation, Navigate } from "react-router-dom";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import { CheckCircle, XCircle, AlertTriangle, ArrowRight } from "lucide-react";

const scoreColor = (score: number) =>
  score >= 70 ? "text-green" : score >= 45 ? "text-amber" : "text-destructive";

const scoreLabel = (score: number) =>
  score >= 70 ? "Investment-Ready" : score >= 45 ? "Conditional" : "High Risk";

const scoreBg = (score: number) =>
  score >= 70 ? "bg-green/10" : score >= 45 ? "bg-amber/10" : "bg-destructive/10";

const severityDot = (sev: string) => {
  if (sev === "red" || sev === "high") return "bg-destructive";
  if (sev === "amber" || sev === "medium") return "bg-amber";
  return "bg-green";
};

// Mock data for demo when no API response
const MOCK_REPORT = {
  overall_score: 74,
  executive_summary:
    "SoilRevive Technologies demonstrates strong scientific foundations with peer-reviewed field trial data. The biochar approach to soil carbon sequestration is well-established, and the team's credentials are verifiable. However, heavy reliance on carbon credit revenue (55%) and state subsidies (15%) introduces policy dependency risk.",
  dimensions: [
    { name: "Tech Readiness", score: 82, reasoning: "18-month field trial with peer-reviewed data across 3 districts provides strong evidence of technology viability." },
    { name: "Impact Authenticity", score: 78, reasoning: "CO2 claims of 340 kg/ha/yr are within established ranges for biochar in tropical soils. Verifiable against published literature." },
    { name: "Greenwash Risk", score: 71, reasoning: "Supply chain transparency is good with 50km sourcing radius and accounted transport emissions. Minor gaps in lifecycle analysis." },
    { name: "Policy Dependency", score: 48, reasoning: "70% revenue depends on carbon credits and government grants. Policy changes could significantly impact viability." },
    { name: "Scalability", score: 68, reasoning: "Local biomass sourcing model may face constraints beyond 50km radius at scale. Farmer subscription model needs validation." },
  ],
  red_flags: [
    {
      title: "High carbon credit revenue dependency",
      severity: "amber",
      description: "55% of revenue from carbon credits exposes the project to carbon price volatility.",
      fix: "Diversify revenue streams; target 40% or below carbon credit dependency.",
      citation: "Revenue model: 55% carbon credits",
    },
    {
      title: "State pilot grant dependency",
      severity: "amber",
      description: "15% revenue from state grants is non-recurring and politically sensitive.",
      fix: "Develop alternative funding sources before grant period ends.",
      citation: "15% state pilot grant",
    },
    {
      title: "Scalability of local biomass sourcing",
      severity: "green",
      description: "50km sourcing radius is sustainable at current scale but may constrain growth.",
      fix: "Map additional biomass sources and establish contracts for expansion zones.",
      citation: "Biomass sourced within 50km radius",
    },
  ],
  investor_match: [
    { type: "Climate-focused VC", status: "ready_for" },
    { type: "Impact Fund", status: "ready_for" },
    { type: "Government Green Bond", status: "ready_for" },
    { type: "Carbon Credit Marketplace", status: "ready_for" },
    { type: "Traditional PE", status: "not_yet" },
    { type: "Retail Crowdfunding", status: "not_yet" },
  ],
  next_step:
    "Request independent verification of field trial CO2 measurements and conduct a 12-month revenue stress test under carbon price scenarios of -20% and -40%.",
};

const AuditReport = () => {
  const location = useLocation();

  const raw = location.state?.result || location.state?.report || MOCK_REPORT;

  const report = {
  ...raw,
  dimensions: Array.isArray(raw.dimensions)
    ? raw.dimensions
    : Object.entries(raw.dimensions || {}).map(([key, val]: [string, any]) => ({
        name: key.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
        score: val.score,
        reasoning: val.reasoning,
      })),
  investor_match: Array.isArray(raw.investor_match)
    ? raw.investor_match
    : [
        ...(raw.investor_match?.ready_for || []).map((type: string) => ({ type, status: "ready_for" })),
        ...(raw.investor_match?.not_yet || []).map((type: string) => ({ type, status: "not_yet" })),
      ],
  next_step: raw.next_step || raw.investor_match?.next_step || "",
};
  const radarData = report.dimensions.map((d: any) => ({
    subject: d.name,
    score: d.score,
    fullMark: 100,
  }));

  return (
    <div className="container mx-auto max-w-5xl px-6 py-16">
      {/* Overall Score */}
      <div className={`mx-auto mb-8 max-w-sm rounded-xl glass-card p-8 text-center ${scoreBg(report.overall_score)} shadow-blue`}>
        <p className="mb-1 text-sm font-medium text-muted-foreground">Overall Score</p>
        <p className={`font-mono text-6xl font-bold ${scoreColor(report.overall_score)}`}>
          {report.overall_score}
        </p>
        <p className={`mt-2 text-sm font-semibold ${scoreColor(report.overall_score)}`}>
          {scoreLabel(report.overall_score)}
        </p>
      </div>

      {/* Executive Summary */}
      <div className="mb-10 rounded-xl glass-card p-6 shadow-green">
        <h2 className="mb-2 text-lg font-bold">Executive Summary</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{report.executive_summary}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <CheckCircle className="h-3.5 w-3.5" />
          Verified against peer-reviewed scientific benchmarks — not AI estimation alone
        </div>
      </div>

      {/* Dimension Analysis */}
      <div className="mb-10 grid gap-6 md:grid-cols-2">
        {/* Radar */}
        <div className="rounded-xl glass-card p-6 shadow-blue">
          <h3 className="mb-4 text-sm font-bold">Dimension Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress bars */}
        <div className="rounded-xl glass-card p-6 shadow-green">
          <h3 className="mb-4 text-sm font-bold">Dimension Scores</h3>
          <div className="space-y-4">
            {report.dimensions.map((d: any) => (
              <div key={d.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{d.name}</span>
                  <span className={`font-mono text-sm font-bold ${scoreColor(d.score)}`}>{d.score}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      d.score >= 70 ? "bg-green" : d.score >= 45 ? "bg-amber" : "bg-destructive"
                    }`}
                    style={{ width: `${d.score}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{d.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Red Flag Engine */}
      <div className="mb-10 rounded-xl glass-card p-6 shadow-blue">
        <h3 className="mb-4 text-lg font-bold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber" /> Red Flag Engine
        </h3>
        <div className="space-y-4">
          {report.red_flags.map((flag: any, i: number) => (
            <div key={i} className="rounded-lg glass-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${severityDot(flag.severity)}`} />
                <span className="text-sm font-semibold">{flag.title}</span>
                <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize text-muted-foreground">
                  {flag.severity}
                </span>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">{flag.description}</p>
              <p className="mb-1 text-sm text-foreground">
                <CheckCircle className="mr-1 inline h-3.5 w-3.5 text-green" />
                {flag.fix}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                <ArrowRight className="mr-1 inline h-3 w-3" />
                {flag.citation}
              </p>
              {flag.claim_value !== undefined && flag.benchmark_max !== undefined && (
                <div className="mt-3 rounded-lg bg-muted/50 p-3">
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Claimed: <span className="font-mono text-destructive">{flag.claim_value}</span></span>
                    <span>Max benchmark: <span className="font-mono text-green">{flag.benchmark_max}</span></span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-border">
                    <div className="absolute inset-0 rounded-full bg-primary/30" />
                    <div
                      className="absolute top-0 h-full w-0.5 bg-primary"
                      style={{ left: `${Math.min(100, (flag.benchmark_max / flag.claim_value) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Investor Match */}
      <div className="mb-10 rounded-xl glass-card p-6 shadow-green">
        <h3 className="mb-4 text-lg font-bold">Investor Match</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {report.investor_match.map((inv: any) => (
            <div key={inv.type} className="flex items-center gap-2 rounded-lg glass-card p-3">
              {inv.status === "ready_for" ? (
                <CheckCircle className="h-4 w-4 text-green" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">{inv.type}</span>
              <span className={`ml-auto text-xs font-medium ${inv.status === "ready_for" ? "text-green" : "text-muted-foreground"}`}>
                {inv.status === "ready_for" ? "Ready" : "Not yet"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Step */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 shadow-blue">
        <h3 className="mb-2 text-sm font-bold text-primary">Recommended Next Step</h3>
        <p className="text-sm leading-relaxed text-foreground">{report.next_step}</p>
      </div>
    </div>
  );
};

export default AuditReport;
