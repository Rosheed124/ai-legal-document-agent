"use client";

// Import React hooks
import React, { useState } from "react";
// Import icons
import {
  ShieldAlert,
  PlusCircle,
  Check,
  Info,
  ShieldCheck,
} from "lucide-react";
// Import types
import { MissingSafeguard } from "@/lib/types";

// Component props interface
interface MissingSafeguardsProps {
  // List of missing safeguards
  safeguards: MissingSafeguard[];
  // Handler when user inserts a missing safeguard into their active agreement
  onInsertSafeguard: (safeguard: MissingSafeguard) => void;
}

// Missing safeguards component surfacing critical omissions that expose the signer
export function MissingSafeguards({
  safeguards,
  onInsertSafeguard,
}: MissingSafeguardsProps) {
  // State tracking which safeguard was just inserted
  const [insertedId, setInsertedId] = useState<string | null>(null);

  // Handle inserting safeguard
  const handleInsert = (safe: MissingSafeguard) => {
    onInsertSafeguard(safe);
    setInsertedId(safe.id);
    setTimeout(() => setInsertedId(null), 2500);
  };

  return (
    <div className="rounded-2xl border border-legal-border bg-legal-surface p-6 shadow-sm space-y-5">
      {/* Header title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-legal-border">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-legal-text flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Missing Standard Legal Safeguards ({safeguards.length})
          </h3>
          <p className="text-xs text-legal-muted mt-0.5">
            Standard commercial contracts include these clauses to protect both parties. Their absence indicates an unbalanced agreement.
          </p>
        </div>
      </div>

      {/* Empty state if all safeguards exist */}
      {safeguards.length === 0 && (
        <div className="p-8 rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 text-center">
          <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-emerald-500">
            All Key Institutional Safeguards Detected!
          </p>
          <p className="text-xs text-legal-muted mt-1">
            This agreement contains standard liability caps, data deletion rules, and notice provisions.
          </p>
        </div>
      )}

      {/* Safeguards cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeguards.map((safe) => (
          <div
            key={safe.id}
            className={`rounded-xl border p-4 transition-all flex flex-col justify-between ${
              safe.isAdded
                ? "border-emerald-500/40 bg-emerald-500/5"
                : "border-legal-border bg-legal-subtle/30"
            }`}
          >
            <div>
              {/* Title & status */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-xs sm:text-sm font-bold text-legal-text">
                  {safe.title}
                </h4>
                {safe.isAdded ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Inserted
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Missing
                  </span>
                )}
              </div>

              {/* Importance description */}
              <div className="flex items-start gap-1.5 text-xs text-legal-muted mb-3">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{safe.importance}</p>
              </div>

              {/* Standard boilerplate text box */}
              <div className="p-2.5 rounded-lg bg-legal-surface border border-legal-border text-[11px] font-mono text-legal-text/90 leading-relaxed mb-4">
                &ldquo;{safe.standardClause}&rdquo;
              </div>
            </div>

            {/* Bottom action: Insert button */}
            <div className="pt-2 border-t border-legal-border/40 flex justify-end">
              <button
                onClick={() => handleInsert(safe)}
                disabled={safe.isAdded}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  safe.isAdded
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 cursor-default"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {insertedId === safe.id || safe.isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Appended to Contract</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Append Safeguard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
