"use client";

// Import React hooks for managing state
import React, { useState } from "react";
// Import Lucide icons for visual actions
import {
  Scale,
  Sun,
  Moon,
  Download,
  Share2,
  Check,
  Github,
  ShieldCheck,
} from "lucide-react";
// Import theme hook
import { useTheme } from "./theme-provider";
// Import analysis result type for the export action
import { AnalysisResult } from "@/lib/types";

// Component props interface
interface HeaderProps {
  // Current active analysis result to export
  analysis: AnalysisResult;
}

// Global top navigation header component
export function Header({ analysis }: HeaderProps) {
  // Access theme state and toggle function
  const { theme, toggleTheme } = useTheme();
  // State tracking whether the share link was recently clicked
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  // State tracking whether export download is occurring
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Handle copying a summary of the audit to the user's clipboard
  const handleShare = async () => {
    // Generate text summary
    const summaryText = `[LexAgent AI Audit Report] Document: ${analysis.documentTitle} | Risk Score: ${analysis.overallScore}/100 | Flagged Clauses: ${analysis.clauses.length} | Missing Safeguards: ${analysis.missingSafeguards.length}`;
    // Copy text to clipboard
    await navigator.clipboard.writeText(summaryText);
    // Show checkmark feedback
    setCopiedShare(true);
    // Reset checkmark feedback after 2 seconds
    setTimeout(() => {
      setCopiedShare(false);
    }, 2000);
  };

  // Handle exporting the complete audit report as a downloadable Markdown file
  const handleExport = () => {
    // Start exporting state
    setIsExporting(true);
    // Build a structured markdown report
    const markdownContent = `# ⚖️ LexAgent AI — Contract Audit & Risk Assessment Report

**Document Title:** ${analysis.documentTitle}  
**Date of Audit:** ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}  
**Overall Risk Score:** ${analysis.overallScore}/100 (${analysis.overallScore >= 75 ? "CRITICAL LIABILITY" : analysis.overallScore >= 45 ? "MODERATE RISK" : "LOW RISK"})  
**Auditor Engine:** LexAgent AI v1.0 (Lead Architect: Fagbenro Rosheed Iyiola — LL.B Scholar & AI Engineer)  

---

## 1. Executive Summary
${analysis.executiveSummary}

---

## 2. Risk Scorecard by Category
- **Indemnification & Liability:** ${analysis.categoryScores.indemnity}/100
- **Limitation of Liability Caps:** ${analysis.categoryScores.liability}/100
- **Intellectual Property Rights:** ${analysis.categoryScores.intellectual_prop}/100
- **Termination & Covenants:** ${analysis.categoryScores.termination}/100
- **Confidentiality Scope:** ${analysis.categoryScores.confidentiality}/100
- **Governing Law & Forum:** ${analysis.categoryScores.governing_law}/100

---

## 3. Flagged Clauses & Recommended Redlines (${analysis.clauses.length} Clauses)

${analysis.clauses
  .map(
    (c, i) => `### ${i + 1}. ${c.title} [Risk: ${c.riskScore}/100 — ${c.riskLevel.toUpperCase()}]
**Original Text:**
> "${c.originalText}"

**Legal Hazard Analysis:**
${c.explanation}

**Recommended Counter-Clause (Remediation):**
\`\`\`
${c.suggestedRemediation}
\`\`\`
**Status:** ${c.isResolved ? "✅ Resolved by user" : "⚠️ Needs negotiation"}
`
  )
  .join("\n")}

---

## 4. Missing Standard Safeguards (${analysis.missingSafeguards.length} Items)

${analysis.missingSafeguards
  .map(
    (s, i) => `### ${i + 1}. ${s.title}
**Importance:** ${s.importance}

**Recommended Standard Language:**
> ${s.standardClause}
`
  )
  .join("\n")}

---

## 5. Governing Law & Dispute Forum
- **Detected Jurisdiction:** ${analysis.jurisdiction.detectedJurisdiction}
- **Dispute Forum:** ${analysis.jurisdiction.disputeForum}
- **Prevailing Party Fee Shifting:** ${analysis.jurisdiction.feeShifting ? "Yes (Winner gets fees)" : "No (American Rule / Each pays own fees)"}
- **Enforceability Guidance:** ${analysis.jurisdiction.enforceabilityNotes}

*Generated autonomously by LexAgent AI — Built with Next.js 15, TypeScript, & Tailwind CSS.*
`;

    // Create a Blob with the markdown content
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" });
    // Generate temporary download URL
    const url = URL.createObjectURL(blob);
    // Create an invisible anchor tag
    const link = document.createElement("a");
    // Set file download name
    link.download = `lexagent-audit-${analysis.documentTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.md`;
    // Attach URL to link
    link.href = url;
    // Append link to DOM temporarily
    document.body.appendChild(link);
    // Programmatically click link to trigger browser download
    link.click();
    // Remove link from DOM
    document.body.removeChild(link);
    // Revoke object URL to free memory
    URL.revokeObjectURL(url);
    // Reset export state
    setIsExporting(false);
  };

  // Render header layout
  return (
    <header className="sticky top-0 z-50 w-full border-b border-legal-border bg-legal-surface/90 backdrop-blur-md px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand identity & engineer attribution */}
        <div className="flex items-center gap-3">
          {/* Logo icon container */}
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-legal-text">
                LexAgent <span className="text-blue-600 dark:text-blue-400">AI</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <ShieldCheck className="w-3 h-3" /> Day 2 AI Agent
              </span>
            </div>
            <p className="text-xs text-legal-muted">
              Built by <span className="font-medium text-legal-text">Fagbenro Rosheed Iyiola</span> (LL.B Scholar & AI Engineer)
            </p>
          </div>
        </div>

        {/* Action buttons and controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* GitHub link button */}
          <a
            href="https://github.com/Rosheed124/ai-legal-document-agent"
            target="_blank"
            rel="noopener noreferrer"
            title="View Source on GitHub"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-legal-border bg-legal-subtle text-legal-text hover:bg-legal-border/50 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* Share summary button */}
          <button
            onClick={handleShare}
            title="Copy audit summary to clipboard"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-legal-border bg-legal-subtle text-legal-text hover:bg-legal-border/50 transition-colors"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>

          {/* Export markdown report button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            title="Download complete audit report as Markdown"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>

          {/* Theme switcher button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="p-2 rounded-lg border border-legal-border bg-legal-subtle text-legal-text hover:bg-legal-border/50 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
