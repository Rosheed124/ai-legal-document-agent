"use client";

// Import React hooks
import React, { useState } from "react";
// Import icons
import {
  ShieldAlert,
  GitCompare,
  FileSearch,
  Gavel,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
// Import our modular components
import { Header } from "@/components/header";
import { RiskScorecard } from "@/components/risk-scorecard";
import { PresetSelector } from "@/components/preset-selector";
import { ClauseInspector } from "@/components/clause-inspector";
import { RedlineDiff } from "@/components/redline-diff";
import { MissingSafeguards } from "@/components/missing-safeguards";
import { JurisdictionCard } from "@/components/jurisdiction-card";
// Import contract presets and analyzer logic
import { PRESET_CONTRACTS } from "@/lib/presets";
import { analyzeContract } from "@/lib/analyzer";
// Import types
import { AnalysisResult, MissingSafeguard } from "@/lib/types";

// Main interactive application page
export default function Home() {
  // Initial default contract preset (Enterprise SaaS MSA)
  const defaultPreset = PRESET_CONTRACTS[0];

  // State storing the active contract text
  const [contractText, setContractText] = useState<string>(defaultPreset.text);
  // State storing the active preset ID
  const [activePresetId, setActivePresetId] = useState<string | null>(defaultPreset.id);
  // State storing the current comprehensive analysis result
  const [analysis, setAnalysis] = useState<AnalysisResult>(defaultPreset.defaultAnalysis);
  // State storing the active tab view
  const [activeTab, setActiveTab] = useState<"clauses" | "redlines" | "safeguards" | "jurisdiction">("clauses");
  // State tracking scanning simulation animation
  const [isScanning, setIsScanning] = useState<boolean>(false);
  // State for temporary toast notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper to show temporary toast notification
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handler when contract text is changed or a preset is clicked
  const handleTextChange = (newText: string, presetName?: string) => {
    setContractText(newText);
    // If a preset was chosen by name, look up its precomputed analysis for instant loading
    const matchedPreset = PRESET_CONTRACTS.find((p) => p.name === presetName);
    if (matchedPreset) {
      setAnalysis(matchedPreset.defaultAnalysis);
    } else if (newText.trim().length > 30) {
      // Analyze the custom or modified text
      const newAnalysis = analyzeContract(newText, presetName || "Custom Legal Agreement");
      setAnalysis(newAnalysis);
    }
  };

  // Handler to run fresh autonomous AI audit on demand
  const handleRunAudit = () => {
    setIsScanning(true);
    // Simulate brief agentic thinking delay for dramatic UX polish
    setTimeout(() => {
      const freshAnalysis = analyzeContract(contractText, analysis.documentTitle);
      setAnalysis(freshAnalysis);
      setIsScanning(false);
      showToast("Autonomous contract audit completed successfully!");
    }, 700);
  };

  // Handler to toggle resolved status of a single clause
  const handleToggleResolve = (clauseId: string) => {
    // Clone clauses with the updated resolution status
    const updatedClauses = analysis.clauses.map((clause) => {
      if (clause.id === clauseId) {
        return { ...clause, isResolved: !clause.isResolved };
      }
      return clause;
    });

    // Count how many clauses are now resolved
    const resolvedCount = updatedClauses.filter((c) => c.isResolved).length;
    // Calculate new overall risk score based on resolution progress
    const baseScore = analysis.overallScore;
    // Each accepted resolution lowers the danger score
    const deduction = Math.round((resolvedCount / updatedClauses.length) * (baseScore - 20));
    const newScore = Math.max(15, baseScore - deduction);

    // Update state
    setAnalysis({
      ...analysis,
      clauses: updatedClauses,
      overallScore: newScore,
    });

    showToast("Remediation updated — document risk score recalculated.");
  };

  // Handler to apply all suggested remediations at once
  const handleApplyAllFixes = () => {
    // Mark all clauses as resolved
    const allFixedClauses = analysis.clauses.map((c) => ({
      ...c,
      isResolved: true,
    }));

    // Lower the overall risk score to safe institutional level (18/100)
    setAnalysis({
      ...analysis,
      clauses: allFixedClauses,
      overallScore: 18,
    });

    showToast("All AI redlines accepted! Agreement risk lowered to 18/100 (Safe).");
  };

  // Handler when user clicks to insert a missing standard safeguard
  const handleInsertSafeguard = (safeguard: MissingSafeguard) => {
    // Append the standard boilerplate text to the active contract
    const updatedContract = `${contractText.trim()}\n\n/* STANDARD SAFEGUARD: ${safeguard.title.toUpperCase()} */\n${safeguard.standardClause}\n`;
    setContractText(updatedContract);

    // Update missing safeguard state to marked as added
    const updatedSafeguards = analysis.missingSafeguards.map((s) => {
      if (s.id === safeguard.id) {
        return { ...s, isAdded: true };
      }
      return s;
    });

    setAnalysis({
      ...analysis,
      missingSafeguards: updatedSafeguards,
    });

    showToast(`Appended "${safeguard.title}" to active contract text!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-legal-canvas text-legal-text transition-colors">
      {/* Top sticky header */}
      <Header analysis={analysis} />

      {/* Floating notification toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-legal-surface border border-legal-border shadow-lg text-xs sm:text-sm font-medium text-legal-text animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-8 space-y-8">
        {/* Banner hero section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-slate-900/20 border border-blue-500/20 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Sparkles className="w-3 h-3" /> Autonomous Contract Intelligence
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-legal-text">
              AI Legal Risk Auditor & Redline Remediation Engine
            </h1>
            <p className="text-xs sm:text-sm text-legal-muted mt-1 max-w-2xl">
              Extract covenants, quantify one-sided liabilities, identify missing legal safeguards, and generate balanced counter-clauses with plain-English risk assessments.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-legal-border bg-legal-surface text-legal-muted">
              Document: <strong className="text-legal-text">{analysis.documentTitle}</strong>
            </span>
          </div>
        </div>

        {/* Contract Input & Presets section */}
        <PresetSelector
          text={contractText}
          onTextChange={handleTextChange}
          onRunAudit={handleRunAudit}
          isScanning={isScanning}
          activePresetId={activePresetId}
          setActivePresetId={setActivePresetId}
        />

        {/* Risk Scorecard & Executive Metrics */}
        <RiskScorecard analysis={analysis} />

        {/* Multi-Tab Analysis Navigation */}
        <div className="space-y-4">
          {/* Tabs header */}
          <div className="flex items-center gap-2 border-b border-legal-border overflow-x-auto pb-px">
            {/* Tab 1: Clause Risk Inspector */}
            <button
              onClick={() => setActiveTab("clauses")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === "clauses"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-500/5 rounded-t-lg"
                  : "border-transparent text-legal-muted hover:text-legal-text"
              }`}
            >
              <FileSearch className="w-4 h-4" />
              <span>Clause Risk Inspector</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-legal-subtle font-mono">
                {analysis.clauses.length}
              </span>
            </button>

            {/* Tab 2: Redline Comparison */}
            <button
              onClick={() => setActiveTab("redlines")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === "redlines"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-500/5 rounded-t-lg"
                  : "border-transparent text-legal-muted hover:text-legal-text"
              }`}
            >
              <GitCompare className="w-4 h-4" />
              <span>Redline Counter-Clauses</span>
            </button>

            {/* Tab 3: Missing Safeguards */}
            <button
              onClick={() => setActiveTab("safeguards")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === "safeguards"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-500/5 rounded-t-lg"
                  : "border-transparent text-legal-muted hover:text-legal-text"
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Missing Safeguards</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-mono">
                {analysis.missingSafeguards.length}
              </span>
            </button>

            {/* Tab 4: Governing Law & Jurisdiction */}
            <button
              onClick={() => setActiveTab("jurisdiction")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === "jurisdiction"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-500/5 rounded-t-lg"
                  : "border-transparent text-legal-muted hover:text-legal-text"
              }`}
            >
              <Gavel className="w-4 h-4" />
              <span>Forum & Governing Law</span>
            </button>
          </div>

          {/* Active tab content container */}
          <div className="pt-2">
            {activeTab === "clauses" && (
              <ClauseInspector
                clauses={analysis.clauses}
                onToggleResolve={handleToggleResolve}
              />
            )}

            {activeTab === "redlines" && (
              <RedlineDiff
                clauses={analysis.clauses}
                onApplyAllFixes={handleApplyAllFixes}
              />
            )}

            {activeTab === "safeguards" && (
              <MissingSafeguards
                safeguards={analysis.missingSafeguards}
                onInsertSafeguard={handleInsertSafeguard}
              />
            )}

            {activeTab === "jurisdiction" && (
              <JurisdictionCard jurisdiction={analysis.jurisdiction} />
            )}
          </div>
        </div>
      </main>

      {/* Global footer */}
      <footer className="border-t border-legal-border bg-legal-surface/60 py-6 px-4 lg:px-8 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-legal-muted">
          <div>
            <p>
              © 2026 LexAgent AI. Architected by{" "}
              <strong className="text-legal-text">Fagbenro Rosheed Iyiola</strong> (Frontend & Automation Engineer | LL.B Law Scholar).
            </p>
            <p className="text-[11px] mt-0.5">
              Built with Next.js 15 App Router, React 19, TypeScript 5.7 strict, Tailwind CSS, & Vitest.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Day 2 of 7 Complete
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
