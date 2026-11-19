"use client";

// Import React hooks
import React, { useState } from "react";
// Import icons
import {
  GitCompare,
  Copy,
  Check,
  CheckCheck,
  FileCheck,
} from "lucide-react";
// Import types
import { ContractClause } from "@/lib/types";

// Component props
interface RedlineDiffProps {
  // Flagged clauses with original text and suggested counter-clauses
  clauses: ContractClause[];
  // Callback when user accepts all fixes at once
  onApplyAllFixes: () => void;
}

// Redline comparison component displaying side-by-side contract alterations
export function RedlineDiff({ clauses, onApplyAllFixes }: RedlineDiffProps) {
  // State for copied feedback
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  // State for view layout mode: split side-by-side vs unified
  const [viewMode, setViewMode] = useState<"split" | "unified">("split");

  // Check if all clauses are already marked as resolved
  const allResolved = clauses.length > 0 && clauses.every((c) => c.isResolved);

  // Copy full redline text to clipboard
  const handleCopyRedline = async () => {
    const textToCopy = clauses
      .map(
        (c, idx) =>
          `[SECTION ${idx + 1}: ${c.title.toUpperCase()}]\nREPLACED UNILATERAL LANGUAGE:\n${c.suggestedRemediation}\n`
      )
      .join("\n");
    await navigator.clipboard.writeText(textToCopy);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-legal-border bg-legal-surface p-6 shadow-sm space-y-6">
      {/* Top action toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-legal-border">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-legal-text flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            AI Redline & Remediation Comparison
          </h3>
          <p className="text-xs text-legal-muted mt-0.5">
            Review proposed contract modifications before sending redlines back to counterparties.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle button */}
          <div className="inline-flex rounded-lg border border-legal-border bg-legal-subtle p-0.5 text-xs">
            <button
              onClick={() => setViewMode("split")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === "split"
                  ? "bg-legal-surface text-legal-text shadow-sm"
                  : "text-legal-muted hover:text-legal-text"
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode("unified")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === "unified"
                  ? "bg-legal-surface text-legal-text shadow-sm"
                  : "text-legal-muted hover:text-legal-text"
              }`}
            >
              Unified Diff
            </button>
          </div>

          {/* Copy full redline */}
          <button
            onClick={handleCopyRedline}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-legal-border bg-legal-subtle text-legal-text hover:bg-legal-border/50 transition-colors"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Redlines</span>
              </>
            )}
          </button>

          {/* Apply all remediations button */}
          <button
            onClick={onApplyAllFixes}
            disabled={allResolved || clauses.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{allResolved ? "All Remediations Accepted" : "Accept All AI Fixes"}</span>
          </button>
        </div>
      </div>

      {/* Redline clauses list */}
      <div className="space-y-6">
        {clauses.map((clause, idx) => (
          <div
            key={clause.id}
            className="rounded-xl border border-legal-border bg-legal-subtle/30 overflow-hidden"
          >
            {/* Clause redline header */}
            <div className="px-4 py-2.5 bg-legal-subtle/80 border-b border-legal-border flex items-center justify-between">
              <span className="text-xs font-bold text-legal-text flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-mono">
                  {idx + 1}
                </span>
                {clause.title}
              </span>
              {clause.isResolved && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                  <FileCheck className="w-3 h-3" /> Fix Applied
                </span>
              )}
            </div>

            {/* Split layout: Original vs Remediated side by side */}
            {viewMode === "split" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-legal-border">
                {/* Left column: Original unilateral language */}
                <div className="p-4 bg-red-500/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 block mb-2">
                    Original Contract Terms (Flagged)
                  </span>
                  <div className="text-xs text-legal-text/80 leading-relaxed font-mono bg-legal-surface/60 p-3 rounded-lg border border-red-500/20 line-through decoration-red-500/60">
                    {clause.originalText}
                  </div>
                </div>

                {/* Right column: Remediated balanced counter-clause */}
                <div className="p-4 bg-emerald-500/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-2">
                    Proposed Institutional Counter-Clause
                  </span>
                  <div className="text-xs text-legal-text leading-relaxed font-mono bg-legal-surface/80 p-3 rounded-lg border border-emerald-500/30">
                    {clause.suggestedRemediation}
                  </div>
                </div>
              </div>
            ) : (
              /* Unified layout: Strikethrough old, followed by new */
              <div className="p-4 space-y-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 line-through">
                  - {clause.originalText}
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  + {clause.suggestedRemediation}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
