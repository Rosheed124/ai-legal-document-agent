// Import data types for analysis results
import { AnalysisResult } from "./types";

// Function to generate and immediately download a clean, multi-page PDF audit report
export async function generatePdfReport(analysis: AnalysisResult): Promise<void> {
  // Dynamically load jsPDF on the client side only when user clicks export (avoids SSR issues)
  const { jsPDF } = await import("jspdf");

  // Create a new PDF document in portrait orientation with millimeters as units and A4 page size
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Page width for A4 is 210mm
  const pageWidth = 210;
  // Page height for A4 is 297mm
  const pageHeight = 297;
  // Left and right margins
  const margin = 15;
  // Usable content width between margins
  const contentWidth = pageWidth - margin * 2;
  // Starting vertical Y position on the page
  let y = margin;

  // Helper function to check if we are getting close to the bottom of the page and need a new page
  const ensureSpace = (requiredHeight: number) => {
    // If the next section would spill past the bottom margin
    if (y + requiredHeight > pageHeight - margin - 10) {
      // Add a fresh blank page to the PDF
      doc.addPage();
      // Reset the vertical position back to the top margin
      y = margin;
    }
  };

  // 1. Draw top executive header banner
  // Set fill color to a deep authoritative navy blue
  doc.setFillColor(15, 23, 42);
  // Draw filled rectangle spanning across the top of the first page
  doc.rect(margin, y, contentWidth, 24, "F");

  // Set text color to white for high contrast
  doc.setTextColor(255, 255, 255);
  // Set bold font style
  doc.setFont("helvetica", "bold");
  // Set font size for main title
  doc.setFontSize(14);
  // Draw main title inside the navy banner
  doc.text("LEXAGENT AI — LEGAL RISK & COMPLIANCE AUDIT", margin + 5, y + 9);

  // Set smaller font size for subtitle
  doc.setFontSize(8);
  // Set font style to normal
  doc.setFont("helvetica", "normal");
  // Draw subtitle with engineer name and credentials
  doc.text(
    "Auditor: Fagbenro Rosheed Iyiola (LL.B Law Scholar & AI Engineer) | University of Ibadan",
    margin + 5,
    y + 15
  );
  // Draw date and timestamp
  doc.text(
    `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} | Document: ${analysis.documentTitle}`,
    margin + 5,
    y + 20
  );

  // Move vertical position down below the banner
  y += 30;

  // 2. Executive Scorecard Section
  // Check if we need space for scorecard box
  ensureSpace(35);

  // Choose background color based on danger score
  if (analysis.overallScore >= 70) {
    // Soft red background for high risk
    doc.setFillColor(254, 242, 242);
    // Dark red border
    doc.setDrawColor(239, 68, 68);
  } else if (analysis.overallScore >= 40) {
    // Soft amber background for moderate risk
    doc.setFillColor(255, 251, 235);
    // Amber border
    doc.setDrawColor(245, 158, 11);
  } else {
    // Soft emerald background for low risk
    doc.setFillColor(240, 253, 244);
    // Emerald border
    doc.setDrawColor(34, 197, 94);
  }

  // Draw scorecard border rectangle
  doc.rect(margin, y, contentWidth, 30, "FD");

  // Draw score text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  // Set score color
  if (analysis.overallScore >= 70) doc.setTextColor(220, 38, 38);
  else if (analysis.overallScore >= 40) doc.setTextColor(217, 119, 6);
  else doc.setTextColor(22, 163, 74);

  // Draw big number
  doc.text(`${analysis.overallScore} / 100`, margin + 6, y + 14);

  // Draw severity label
  doc.setFontSize(10);
  const severityText =
    analysis.overallScore >= 70
      ? "CRITICAL LIABILITY ALERT"
      : analysis.overallScore >= 40
      ? "MODERATE CAUTION ADVISED"
      : "BALANCED / LOW RISK";
  doc.text(severityText, margin + 6, y + 22);

  // Draw executive summary on the right side of the box
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  // Wrap summary text into multiple lines so it fits neatly
  const summaryLines = doc.splitTextToSize(analysis.executiveSummary, contentWidth - 65);
  doc.text(summaryLines, margin + 60, y + 8);

  // Move vertical position down
  y += 36;

  // 3. Category Breakdown Grid
  ensureSpace(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("1. RISK BREAKDOWN BY LEGAL CATEGORY", margin, y);
  y += 5;

  // Categories list
  const catList = [
    { label: "Indemnity & Defense", score: analysis.categoryScores.indemnity },
    { label: "Liability & Damages Cap", score: analysis.categoryScores.liability },
    { label: "Intellectual Property", score: analysis.categoryScores.intellectual_prop },
    { label: "Termination & Covenants", score: analysis.categoryScores.termination },
    { label: "Confidentiality Scope", score: analysis.categoryScores.confidentiality },
    { label: "Governing Law & Forum", score: analysis.categoryScores.governing_law },
  ];

  // Draw categories in 2 columns
  doc.setFontSize(8.5);
  catList.forEach((cat, index) => {
    // Calculate column X position (column 0 or column 1)
    const colX = margin + (index % 2) * (contentWidth / 2);
    // Calculate row Y position
    const rowY = y + Math.floor(index / 2) * 6;

    // Set gray card background
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(colX, rowY - 4, contentWidth / 2 - 4, 5.5, "FD");

    // Draw label
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(cat.label, colX + 3, rowY);

    // Draw score with color
    doc.setFont("helvetica", "bold");
    if (cat.score >= 70) doc.setTextColor(220, 38, 38);
    else if (cat.score >= 40) doc.setTextColor(217, 119, 6);
    else doc.setTextColor(22, 163, 74);
    doc.text(`${cat.score}%`, colX + contentWidth / 2 - 14, rowY);
  });

  // Advance Y past the 3 rows of categories
  y += 24;

  // 4. Flagged Clauses Section
  ensureSpace(15);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`2. FLAGGED CONTRACT CLAUSES & REMEDIATIONS (${analysis.clauses.length} ITEMS)`, margin, y);
  y += 6;

  // Iterate over each clause and print details
  analysis.clauses.forEach((clause, idx) => {
    // Estimate height needed for this clause block
    ensureSpace(45);

    // Clause header bar
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, y, contentWidth, 6, "FD");

    // Clause title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${idx + 1}. ${clause.title} [Risk: ${clause.riskScore}% — ${clause.riskLevel.toUpperCase()}]`, margin + 3, y + 4.2);

    y += 9;

    // Original excerpt
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("ORIGINAL EXCERPT:", margin + 2, y);
    y += 3.5;

    doc.setFont("helvetica", "italic");
    doc.setTextColor(51, 65, 85);
    const origLines = doc.splitTextToSize(`"${clause.originalText}"`, contentWidth - 6);
    doc.text(origLines, margin + 4, y);
    y += origLines.length * 3.5 + 2;

    // Plain-English Hazard explanation
    ensureSpace(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(217, 119, 6);
    doc.text("WHY THIS IS DANGEROUS (PLAIN ENGLISH):", margin + 2, y);
    y += 3.5;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    const explLines = doc.splitTextToSize(clause.explanation, contentWidth - 6);
    doc.text(explLines, margin + 4, y);
    y += explLines.length * 3.5 + 2;

    // Suggested Remediation
    ensureSpace(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(37, 99, 235);
    doc.text("RECOMMENDED COUNTER-CLAUSE (REMEDIATION):", margin + 2, y);
    y += 3.5;

    // Light blue box for recommended language
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    const remLines = doc.splitTextToSize(clause.suggestedRemediation, contentWidth - 10);
    const boxHeight = remLines.length * 3.5 + 4;
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(191, 219, 254);
    doc.rect(margin + 2, y - 2, contentWidth - 4, boxHeight, "FD");
    doc.text(remLines, margin + 5, y + 2);
    y += boxHeight + 4;
  });

  // 5. Missing Safeguards Section
  ensureSpace(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`3. MISSING INSTITUTIONAL SAFEGUARDS (${analysis.missingSafeguards.length} ITEMS)`, margin, y);
  y += 6;

  analysis.missingSafeguards.forEach((safe) => {
    ensureSpace(25);
    // Draw missing safeguard title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(180, 83, 9);
    doc.text(`• ${safe.title} (MISSING)`, margin + 2, y);
    y += 4;

    // Draw importance
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const impLines = doc.splitTextToSize(`Importance: ${safe.importance}`, contentWidth - 6);
    doc.text(impLines, margin + 5, y);
    y += impLines.length * 3.5 + 1.5;

    // Draw standard clause
    doc.setFont("helvetica", "italic");
    doc.setTextColor(30, 41, 59);
    const standardLines = doc.splitTextToSize(`Language to Insert: "${safe.standardClause}"`, contentWidth - 6);
    doc.text(standardLines, margin + 5, y);
    y += standardLines.length * 3.5 + 3.5;
  });

  // 6. Governing Law & Dispute Forum
  ensureSpace(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("4. GOVERNING LAW & FORUM ANALYSIS", margin, y);
  y += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(`• Detected Jurisdiction: ${analysis.jurisdiction.detectedJurisdiction}`, margin + 2, y);
  y += 4.5;
  doc.text(`• Dispute Forum: ${analysis.jurisdiction.disputeForum}`, margin + 2, y);
  y += 4.5;
  doc.text(
    `• Attorney Fee Shifting: ${
      analysis.jurisdiction.feeShifting
        ? "Yes (English Rule — prevailing party recovers fees)"
        : "No (American Rule — each party pays own fees)"
    }`,
    margin + 2,
    y
  );
  y += 4.5;
  const noteLines = doc.splitTextToSize(`• Guidance: ${analysis.jurisdiction.enforceabilityNotes}`, contentWidth - 6);
  doc.text(noteLines, margin + 2, y);
  y += noteLines.length * 4 + 6;

  // Add page numbers at the bottom of all generated pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    // Switch to page i
    doc.setPage(i);
    // Draw thin divider line
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    // Draw footer text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "LexAgent AI • Autonomous Legal Intelligence • Built by Fagbenro Rosheed Iyiola",
      margin,
      pageHeight - 7
    );
    // Draw page number on right
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 18, pageHeight - 7);
  }

  // Generate safe filename from document title
  const safeTitle = analysis.documentTitle.toLowerCase().replace(/[^a-z0-9]/g, "-");
  // Trigger immediate browser file download of the PDF!
  doc.save(`lexagent-audit-${safeTitle}.pdf`);
}
