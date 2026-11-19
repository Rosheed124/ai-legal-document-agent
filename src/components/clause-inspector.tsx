"use client";

// Import React hooks
import React, { useState } from "react";
// Import icons
import {
  AlertCircle,
  Copy,
  Check,
  Search,
  CheckCircle2,
  FileCheck2,
  Shield,
} from "lucide-react";
// Import types
import { ContractClause, RiskLevel } from "@/lib/types";
// Import utils
import { getRiskBadgeProps } from "@/lib/utils";

// Component props interface
interface ClauseInspectorProps {
  // Array of contract clauses
  clauses: ContractClause[];
  // Handler when user toggles resolving a clause
  onToggleResolve: (clauseId: string) => void;
}

// Clause inspector component for deep-dive analysis of individual contract covenants
export function ClauseInspector({
  clauses,
  onToggleResolve,
}: ClauseInspectorProps) {
  // State for active risk filter tab
  const [filterLevel, setFilterLevel] = useState<RiskLevel | "all">("all");
  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>("");
  // State tracking which clause was just copied
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Handle copying a remediation counter-clause to clipboard
  const handleCopyClause = async (clause: ContractClause) => {
    await navigator.clipboard.writeText(clause.suggestedRemediation);
    setCopiedId(clause.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter clauses based on active filter tab and search text
  const filteredClauses = clauses.filter((clause) => {
    // Check level filter
    const matchesLevel = filterLevel === "all" || clause.riskLevel === filterLevel;
    // Check search query against title, original text, and explanation
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      clause.title.toLowerCase().includes(lowerQuery) ||
      clause.originalText.toLowerCase().includes(lowerQuery) ||
      clause.explanation.toLowerCase().includes(lowerQuery);
    return matchesLevel && matchesSearch;
  });

  // Calculate counts for each filter pill
  const criticalCount = clauses.filter((c) => c.riskLevel === "critical").length;
  const warningCount = clauses.filter((c) => c.riskLevel === "warning").length;
  const lowCount = clauses.filter((c) => c.riskLevel === "low").length;

  return (
    <div className="space-y-4">
      {/* Controls bar: Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl border border-legal-border bg-legal-surface">
        {/* Filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterLevel("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterLevel === "all"
                ? "bg-legal-text text-legal-canvas shadow-sm"
                : "bg-legal-subtle text-legal-muted hover:text-legal-text"
            }`}
          >
            All Clauses ({clauses.length})
          </button>
          <button
            onClick={() => setFilterLevel("critical")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterLevel === "critical"
                ? "bg-red-500 text-white shadow-sm"
                : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
            }`}
          >
            Critical Liability ({criticalCount})
          </button>
          <button
            onClick={() => setFilterLevel("warning")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterLevel === "warning"
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
            }`}
          >
            Moderate Caution ({warningCount})
          </button>
          <button
            onClick={() => setFilterLevel("low")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterLevel === "low"
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
            }`}
          >
            Standard ({lowCount})
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-legal-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter clauses..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-legal-border bg-legal-subtle text-legal-text placeholder:text-legal-muted/60 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Empty state if nothing matches */}
      {filteredClauses.length === 0 && (
        <div className="p-8 rounded-xl border border-dashed border-legal-border text-center bg-legal-subtle/30">
          <Shield className="w-8 h-8 text-legal-muted mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-legal-text">
            No clauses match your filter criteria.
          </p>
          <p className="text-xs text-legal-muted mt-1">
            Try choosing a different risk level or clearing the search text.
          </p>
        </div>
      )}

      {/* Clauses list */}
      <div className="space-y-4">
        {filteredClauses.map((clause) => {
          // Get badge styles for this risk severity
          const badge = getRiskBadgeProps(clause.riskLevel);

          return (
            <div
              key={clause.id}
              className={`rounded-2xl border p-5 transition-all shadow-sm ${
                clause.isResolved
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-legal-border bg-legal-surface"
              }`}
            >
              {/* Clause card header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-legal-border/60">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="text-sm font-bold text-legal-text flex items-center gap-2">
                    {clause.title}
                  </h4>
                  {/* Category tag */}
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-legal-subtle text-legal-muted border border-legal-border">
                    {clause.category.replace("_", " ")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Danger badge */}
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>
                      {badge.label} ({clause.riskScore}%)
                    </span>
                  </span>

                  {/* Resolved indicator */}
                  {clause.isResolved && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <FileCheck2 className="w-3 h-3" /> Fix Applied
                    </span>
                  )}
                </div>
              </div>

              {/* Original snippet quote box */}
              <div className="mt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-legal-muted block mb-1">
                  Original Contract Excerpt:
                </span>
                <blockquote className="p-3 rounded-xl bg-legal-subtle/70 border-l-4 border-red-500/80 text-xs sm:text-sm font-serif italic text-legal-text/90 leading-relaxed">
                  &ldquo;{clause.originalText}&rdquo;
                </blockquote>
              </div>

              {/* Plain-English legal risk explanation */}
              <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                  Why This Clause Is Dangerous:
                </span>
                <p className="text-xs sm:text-sm text-legal-text leading-relaxed">
                  {clause.explanation}
                </p>
              </div>

              {/* Suggested Remediation counter-clause */}
              <div className="mt-4 p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Recommended Fair Counter-Clause:
                  </span>
                  {/* Copy button */}
                  <button
                    onClick={() => handleCopyClause(clause)}
                    title="Copy counter-clause to clipboard"
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    {copiedId === clause.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Clause</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-legal-surface border border-legal-border text-xs font-mono text-legal-text leading-relaxed">
                  {clause.suggestedRemediation}
                </div>
              </div>

              {/* Bottom action: Accept or toggle remediation fix */}
              <div className="mt-4 pt-3 flex items-center justify-end border-t border-legal-border/50">
                <button
                  onClick={() => onToggleResolve(clause.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    clause.isResolved
                      ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 hover:scale-[1.01] active:scale-[0.99]"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {clause.isResolved ? "Fix Applied (Undo)" : "Accept AI Remediation"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
