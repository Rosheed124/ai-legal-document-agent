"use client";

// Import React
import React from "react";
// Import icons
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Clock,
  FileText,
  CheckCircle2,
} from "lucide-react";
// Import types
import { AnalysisResult } from "@/lib/types";

// Component props
interface RiskScorecardProps {
  // Analysis data to display
  analysis: AnalysisResult;
}

// Risk scorecard component displaying overall contract health and category metrics
export function RiskScorecard({ analysis }: RiskScorecardProps) {
  // Count how many clauses the user has resolved
  const resolvedCount = analysis.clauses.filter((c) => c.isResolved).length;

  // Determine color and status label based on overall risk score
  const getScoreStatus = (score: number) => {
    // High danger threshold (70-100)
    if (score >= 70) {
      return {
        label: "Critical Liability Alert",
        desc: "Significant legal exposure requiring structural redlines before execution.",
        textColor: "text-red-500",
        badgeBg: "bg-red-500/10 text-red-500 border-red-500/30",
        barColor: "bg-red-500",
        icon: ShieldAlert,
      };
    }
    // Moderate risk threshold (40-69)
    if (score >= 40) {
      return {
        label: "Moderate Caution Advised",
        desc: "Terms require targeted adjustments to reach institutional market fairness.",
        textColor: "text-amber-500",
        badgeBg: "bg-amber-500/10 text-amber-500 border-amber-500/30",
        barColor: "bg-amber-500",
        icon: AlertTriangle,
      };
    }
    // Low risk threshold (0-39)
    return {
      label: "Balanced & Low Risk",
      desc: "Terms reflect standard market covenants with balanced protections.",
      textColor: "text-emerald-500",
      badgeBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
      barColor: "bg-emerald-500",
      icon: ShieldCheck,
    };
  };

  // Get status info for the current overall score
  const status = getScoreStatus(analysis.overallScore);
  // Extract icon component
  const StatusIcon = status.icon;

  // Categories list for structured display
  const categories = [
    { key: "indemnity", label: "Indemnity & Defense", score: analysis.categoryScores.indemnity },
    { key: "liability", label: "Liability & Damages Cap", score: analysis.categoryScores.liability },
    { key: "intellectual_prop", label: "Intellectual Property", score: analysis.categoryScores.intellectual_prop },
    { key: "termination", label: "Termination & Covenants", score: analysis.categoryScores.termination },
    { key: "confidentiality", label: "Confidentiality Scope", score: analysis.categoryScores.confidentiality },
    { key: "governing_law", label: "Governing Law & Forum", score: analysis.categoryScores.governing_law },
  ];

  // Render scorecard
  return (
    <div className="rounded-2xl border border-legal-border bg-legal-surface p-6 shadow-sm">
      {/* Top row: Overall composite score + executive verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left score dial column */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-xl bg-legal-subtle/50 border border-legal-border/60 text-center">
          <span className="text-xs font-semibold tracking-wider uppercase text-legal-muted mb-2">
            Contract Risk Rating
          </span>
          {/* Big numeric score */}
          <div className="flex items-baseline gap-1 my-1">
            <span className={`text-6xl font-extrabold tracking-tight ${status.textColor}`}>
              {analysis.overallScore}
            </span>
            <span className="text-xl font-bold text-legal-muted">/100</span>
          </div>
          {/* Status badge pill */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border mt-2 ${status.badgeBg}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{status.label}</span>
          </div>
          <p className="text-xs text-legal-muted mt-3 max-w-xs leading-relaxed">
            {status.desc}
          </p>
        </div>

        {/* Right breakdown column */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full gap-5">
          {/* Executive summary quote */}
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Plain-English Executive Summary
              </span>
            </div>
            <p className="text-xs sm:text-sm text-legal-text leading-relaxed">
              {analysis.executiveSummary}
            </p>
          </div>

          {/* Metric cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Metric 1: Total clauses */}
            <div className="p-3 rounded-lg border border-legal-border bg-legal-subtle/40">
              <div className="flex items-center gap-1.5 text-legal-muted mb-1">
                <FileText className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Flagged Clauses</span>
              </div>
              <span className="text-lg font-bold text-legal-text">
                {analysis.clauses.length}
              </span>
            </div>

            {/* Metric 2: Missing safeguards */}
            <div className="p-3 rounded-lg border border-legal-border bg-legal-subtle/40">
              <div className="flex items-center gap-1.5 text-legal-muted mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-medium">Missing Clauses</span>
              </div>
              <span className="text-lg font-bold text-amber-500">
                {analysis.missingSafeguards.length}
              </span>
            </div>

            {/* Metric 3: Remediations resolved */}
            <div className="p-3 rounded-lg border border-legal-border bg-legal-subtle/40">
              <div className="flex items-center gap-1.5 text-legal-muted mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] font-medium">Fixes Accepted</span>
              </div>
              <span className="text-lg font-bold text-emerald-500">
                {resolvedCount} / {analysis.clauses.length}
              </span>
            </div>

            {/* Metric 4: Review time */}
            <div className="p-3 rounded-lg border border-legal-border bg-legal-subtle/40">
              <div className="flex items-center gap-1.5 text-legal-muted mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Est. Review</span>
              </div>
              <span className="text-lg font-bold text-legal-text">
                {analysis.estimatedReviewMinutes} mins
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section: Category progress bars */}
      <div className="mt-6 pt-6 border-t border-legal-border">
        <h4 className="text-xs font-bold uppercase tracking-wider text-legal-muted mb-4">
          Risk Severity by Legal Category
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            // Determine color for this individual category bar
            const barBg =
              cat.score >= 70
                ? "bg-red-500"
                : cat.score >= 40
                ? "bg-amber-500"
                : "bg-emerald-500";

            return (
              <div
                key={cat.key}
                className="p-3 rounded-xl border border-legal-border/60 bg-legal-subtle/30"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-legal-text">
                    {cat.label}
                  </span>
                  <span className="text-xs font-bold text-legal-muted">
                    {cat.score}%
                  </span>
                </div>
                {/* Visual progress bar */}
                <div className="w-full h-2 rounded-full bg-legal-border overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
