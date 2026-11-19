"use client";

// Import React hooks
import React, { useState } from "react";
// Import icons
import {
  Gavel,
  MapPin,
  Building2,
  DollarSign,
  Copy,
  Check,
  HelpCircle,
} from "lucide-react";
// Import types
import { AnalysisResult } from "@/lib/types";

// Component props
interface JurisdictionCardProps {
  // Jurisdiction data from analysis
  jurisdiction: AnalysisResult["jurisdiction"];
}

// Jurisdiction and dispute resolution analyzer card component
export function JurisdictionCard({ jurisdiction }: JurisdictionCardProps) {
  // State for copy feedback
  const [copied, setCopied] = useState<boolean>(false);

  // Copy jurisdiction facts
  const handleCopy = async () => {
    const text = `Jurisdiction: ${jurisdiction.detectedJurisdiction} | Forum: ${jurisdiction.disputeForum} | Fee Shifting: ${jurisdiction.feeShifting ? "Yes" : "No"} | Notes: ${jurisdiction.enforceabilityNotes}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-legal-border bg-legal-surface p-6 shadow-sm space-y-6">
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-legal-border">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-legal-text flex items-center gap-2">
            <Gavel className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Governing Law & Forum Enforceability Analysis
          </h3>
          <p className="text-xs text-legal-muted mt-0.5">
            Jurisdictional venue dictates court remedies, class action viability, and enforceability of covenants.
          </p>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-legal-border bg-legal-subtle text-legal-text hover:bg-legal-border/50 transition-colors self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Forum Details</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of key jurisdictional indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Venue */}
        <div className="p-4 rounded-xl border border-legal-border bg-legal-subtle/30">
          <div className="flex items-center gap-1.5 text-legal-muted mb-1.5">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold">Detected Venue</span>
          </div>
          <span className="text-sm font-bold text-legal-text block">
            {jurisdiction.detectedJurisdiction}
          </span>
          <span className="text-[11px] text-legal-muted mt-1 block">
            Substantive law applied to disputes
          </span>
        </div>

        {/* Metric 2: Forum */}
        <div className="p-4 rounded-xl border border-legal-border bg-legal-subtle/30">
          <div className="flex items-center gap-1.5 text-legal-muted mb-1.5">
            <Building2 className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-semibold">Dispute Forum</span>
          </div>
          <span className="text-sm font-bold text-legal-text block">
            {jurisdiction.disputeForum}
          </span>
          <span className="text-[11px] text-legal-muted mt-1 block">
            Tribunal designated for conflict resolution
          </span>
        </div>

        {/* Metric 3: Fee Shifting */}
        <div className="p-4 rounded-xl border border-legal-border bg-legal-subtle/30">
          <div className="flex items-center gap-1.5 text-legal-muted mb-1.5">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-semibold">Fee Shifting (Costs)</span>
          </div>
          <span
            className={`text-sm font-bold block ${
              jurisdiction.feeShifting ? "text-emerald-500" : "text-amber-500"
            }`}
          >
            {jurisdiction.feeShifting ? "English Rule (Loser Pays)" : "American Rule (Each Pays Own)"}
          </span>
          <span className="text-[11px] text-legal-muted mt-1 block">
            {jurisdiction.feeShifting
              ? "Prevailing party recovers attorney fees"
              : "No fee recovery; small claims costly"}
          </span>
        </div>
      </div>

      {/* Enforceability assessment box */}
      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Legal Jurisprudence & Enforceability Notes
          </span>
        </div>
        <p className="text-xs sm:text-sm text-legal-text leading-relaxed">
          {jurisdiction.enforceabilityNotes}
        </p>
      </div>
    </div>
  );
}
