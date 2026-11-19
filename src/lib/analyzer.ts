// Import all needed data types
import { AnalysisResult, ClauseCategory, ContractClause, MissingSafeguard, RiskLevel } from "./types";

// Rule pattern to detect specific legal dangers in contracts
interface RiskPattern {
  // Category of legal law this pattern checks
  category: ClauseCategory;
  // Friendly title for the identified risk
  title: string;
  // Danger level classification
  riskLevel: RiskLevel;
  // Numeric danger score (1 to 100)
  riskScore: number;
  // Keywords or phrases that trigger this flag
  triggerWords: string[];
  // Plain English explanation of the danger for a non-lawyer
  explanation: string;
  // Balanced counter-clause to replace the dangerous language
  remediation: string;
}

// Library of known contractual traps commonly found in one-sided agreements
const RISK_PATTERNS: RiskPattern[] = [
  {
    category: "indemnity",
    title: "Unilateral or Uncapped Indemnification",
    riskLevel: "critical",
    riskScore: 92,
    triggerWords: ["indemnify and hold harmless", "defend, indemnify", "shall defend", "customer shall indemnify"],
    explanation: "This clause forces you to pay for the other party's legal battles and court damages, even when the mistake was partly theirs or outside your direct control.",
    remediation: "Each party shall mutually defend and indemnify the other against third-party claims arising directly from gross negligence, willful misconduct, or direct intellectual property infringement.",
  },
  {
    category: "liability",
    title: "Extreme or Asymmetric Liability Cap",
    riskLevel: "critical",
    riskScore: 90,
    triggerWords: ["total aggregate liability", "$100", "one hundred dollars", "limited to the amount paid", "sole remedy"],
    explanation: "The other company is limiting what they owe you to almost zero (or a tiny flat amount) even if their system causes massive financial disruption or data loss for your business.",
    remediation: "Each party's maximum aggregate liability shall be capped at the total amount paid or payable under this Agreement in the twelve (12) months preceding the incident.",
  },
  {
    category: "intellectual_prop",
    title: "AI Training & Data Ingestion Rights",
    riskLevel: "critical",
    riskScore: 88,
    triggerWords: ["train", "machine learning", "artificial intelligence", "models", "perpetual, irrevocable", "usage metrics to improve"],
    explanation: "The vendor is granting itself permission to feed your confidential business information into its AI algorithms, which could end up helping your competitors.",
    remediation: "Vendor shall not use, store, or process Customer Data for the purpose of training, tuning, or enhancing any artificial intelligence or machine learning models without express written authorization.",
  },
  {
    category: "intellectual_prop",
    title: "Broad Work-for-Hire or Inventions Seizure",
    riskLevel: "critical",
    riskScore: 86,
    triggerWords: ["work made for hire", "unconditionally assigns", "all inventions", "whether or not during normal working hours"],
    explanation: "The company claims ownership of your ideas, side projects, and code created outside of work hours without using their company resources.",
    remediation: "Assignment of intellectual property shall be strictly limited to deliverables created during authorized working hours specifically funded by and developed for the Client.",
  },
  {
    category: "termination",
    title: "Immediate Termination Without Pay",
    riskLevel: "critical",
    riskScore: 85,
    triggerWords: ["without cause, immediately", "no obligation to pay", "unapproved hours", "sole discretion"],
    explanation: "The client can cancel the agreement instantly and refuse to pay for work you have already performed in good faith.",
    remediation: "Either party may terminate upon thirty (30) days prior written notice, and Client shall immediately compensate for all services performed and reasonable expenses incurred up to the date of termination.",
  },
  {
    category: "termination",
    title: "Restrictive Non-Compete / Non-Solicit Covenant",
    riskLevel: "warning",
    riskScore: 75,
    triggerWords: ["non-compete", "shall not engage in", "competes with", "solicit, recruit", "twenty-four (24) months"],
    explanation: "This restricts your freedom to work in your chosen profession or hire talented people for years after the contract ends.",
    remediation: "Delete the non-compete clause entirely. Protect sensitive proprietary assets strictly through customary non-disclosure and trade secret protections.",
  },
  {
    category: "termination",
    title: "Auto-Renewal Notice Trap",
    riskLevel: "warning",
    riskScore: 68,
    triggerWords: ["automatically renew", "ninety (90) calendar days", "certified physical mail", "mandatory 15%"],
    explanation: "You could get trapped in an expensive unwanted contract renewal if you miss a strict deadline buried deep in the fine print.",
    remediation: "Renewal shall require affirmative mutual written agreement, or annual notice thirty (30) days in advance with price increases capped at 3% or CPI.",
  },
  {
    category: "confidentiality",
    title: "Perpetual Confidentiality Obligations",
    riskLevel: "warning",
    riskScore: 65,
    triggerWords: ["in perpetuity", "indefinitely", "survive forever"],
    explanation: "Having to keep routine business records secret forever creates endless legal liability long after the information has lost its competitive value.",
    remediation: "Confidentiality obligations shall expire three (3) years after the date of initial disclosure, except for genuine trade secrets protected under applicable law.",
  },
  {
    category: "governing_law",
    title: "Class Action Waiver & Non-Reciprocal Fee Shifting",
    riskLevel: "warning",
    riskScore: 62,
    triggerWords: ["binding individual arbitration", "waives any right to a jury trial", "class action", "shall not be entitled to recover attorney fees"],
    explanation: "You give up the right to join with other injured customers in a group claim and must pay all your own attorney fees even if you win the case.",
    remediation: "Disputes shall be handled in courts of competent jurisdiction, and the prevailing party in any legal action shall be entitled to recover reasonable attorney fees and costs.",
  },
];

// Standard safeguards to check for when auditing a contract
const STANDARD_SAFEGUARDS: { id: string; title: string; checkKeyword: string; importance: string; standardClause: string }[] = [
  {
    id: "safe-1",
    title: "Mutual Limitation of Liability Cap",
    checkKeyword: "mutual",
    importance: "Ensures both companies have equal downside risk rather than placing all liability on one party.",
    standardClause: "Neither party's total liability under this Agreement shall exceed the fees paid or payable by Customer in the preceding 12 months.",
  },
  {
    id: "safe-2",
    title: "Data Deletion & Return Covenant",
    checkKeyword: "delete",
    importance: "Protects sensitive user data by requiring the recipient to securely wipe it when the contract ends.",
    standardClause: "Upon contract termination, recipient shall promptly delete or return all confidential data and provide written confirmation of destruction.",
  },
  {
    id: "safe-3",
    title: "Notice & Opportunity to Cure",
    checkKeyword: "cure",
    importance: "Gives a party 30 days to fix an accidental mistake before the other party can terminate or sue.",
    standardClause: "Neither party may terminate for material breach without providing written notice and a thirty (30) day opportunity to cure such breach.",
  },
  {
    id: "safe-4",
    title: "Force Majeure Clause",
    checkKeyword: "force majeure",
    importance: "Excuses performance delays caused by unpredictable events like floods, wars, power grid failures, or pandemics.",
    standardClause: "Neither party shall be liable for delays or failures in performance resulting from acts of God, strikes, pandemics, or unforeseen events beyond reasonable control.",
  },
];

// Split a full contract text into individual paragraphs or clauses
export function tokenizeClauses(text: string): string[] {
  // Split on double line breaks or numbered section headings
  return text
    .split(/\n\s*\n|(?=\n\s*(?:SECTION|\d+\.))/i)
    // Trim extra whitespace from each section
    .map((chunk) => chunk.trim())
    // Keep only paragraphs with actual readable sentences (at least 20 characters)
    .filter((chunk) => chunk.length > 20);
}

// Analyze raw contract text and generate an audit scorecard
export function analyzeContract(rawText: string, title?: string): AnalysisResult {
  // Break down document into individual paragraphs
  const chunks = tokenizeClauses(rawText);
  // Lowercase version of full text for quick searching
  const lowerText = rawText.toLowerCase();

  // Array to hold all detected clauses
  const detectedClauses: ContractClause[] = [];

  // Loop through each paragraph to see if it matches known legal danger patterns
  chunks.forEach((chunk, index) => {
    // Lowercase version of the chunk
    const lowerChunk = chunk.toLowerCase();
    // Check if any known risk pattern appears in this paragraph
    const matchedPattern = RISK_PATTERNS.find((pattern) =>
      pattern.triggerWords.some((word) => lowerChunk.includes(word.toLowerCase()))
    );

    // If a pattern matched, create an official flagged clause record
    if (matchedPattern) {
      detectedClauses.push({
        id: `clause-auto-${index + 1}`,
        title: matchedPattern.title,
        category: matchedPattern.category,
        riskLevel: matchedPattern.riskLevel,
        riskScore: matchedPattern.riskScore,
        originalText: chunk,
        explanation: matchedPattern.explanation,
        suggestedRemediation: matchedPattern.remediation,
        isResolved: false,
      });
    }
  });

  // If no high-risk patterns matched (e.g. very clean or custom contract), add basic findings
  if (detectedClauses.length === 0 && chunks.length > 0) {
    // Treat first chunk as a standard operational clause
    detectedClauses.push({
      id: "clause-auto-standard-1",
      title: "General Operational Term",
      category: "liability",
      riskLevel: "low",
      riskScore: 25,
      originalText: chunks[0],
      explanation: "This clause appears to follow standard commercial contracting practices without unusual liability traps.",
      suggestedRemediation: "No changes needed; terms appear balanced.",
      isResolved: true,
    });
  }

  // Calculate danger score for each category
  const calculateCategoryScore = (cat: ClauseCategory): number => {
    // Filter clauses belonging to this category
    const catClauses = detectedClauses.filter((c) => c.category === cat);
    // If no clauses found in this category, risk is baseline low (10)
    if (catClauses.length === 0) return 10;
    // Find the highest risk score in this category
    const maxScore = Math.max(...catClauses.map((c) => c.riskScore));
    // Return the highest danger score
    return maxScore;
  };

  // Build the category scores dictionary
  const categoryScores = {
    indemnity: calculateCategoryScore("indemnity"),
    liability: calculateCategoryScore("liability"),
    intellectual_prop: calculateCategoryScore("intellectual_prop"),
    termination: calculateCategoryScore("termination"),
    confidentiality: calculateCategoryScore("confidentiality"),
    governing_law: calculateCategoryScore("governing_law"),
  };

  // Extract all category score values into an array
  const scoresArray = Object.values(categoryScores);
  // Find the single highest danger score present in any category
  const maxCategoryScore = Math.max(...scoresArray);
  // Filter for categories where active clauses were identified (score > 10 baseline)
  const activeScores = scoresArray.filter((score) => score > 10);
  // Calculate average score among the categories that actually have flagged clauses
  const activeAvg = activeScores.length > 0
    ? activeScores.reduce((sum, val) => sum + val, 0) / activeScores.length
    : 10;
  // Blend the maximum danger score and the average active score (50% max risk + 50% active breadth)
  const overallScore = Math.min(100, Math.round(maxCategoryScore * 0.5 + activeAvg * 0.5));

  // Check which standard safeguards are missing from the text
  const missingSafeguards: MissingSafeguard[] = STANDARD_SAFEGUARDS
    // Filter for safeguards whose keywords do not appear anywhere in the document
    .filter((safe) => !lowerText.includes(safe.checkKeyword))
    // Map to the MissingSafeguard interface shape
    .map((safe) => ({
      id: safe.id,
      title: safe.title,
      importance: safe.importance,
      standardClause: safe.standardClause,
      isAdded: false,
    }));

  // Detect governing law jurisdiction
  let detectedJurisdiction = "Undetermined Jurisdiction";
  if (lowerText.includes("delaware")) detectedJurisdiction = "Delaware, United States";
  else if (lowerText.includes("england") || lowerText.includes("wales")) detectedJurisdiction = "England and Wales";
  else if (lowerText.includes("california")) detectedJurisdiction = "California, United States";
  else if (lowerText.includes("new york")) detectedJurisdiction = "New York, United States";

  // Check dispute resolution mechanism
  let disputeForum: "Arbitration" | "State/Federal Court" | "JAMS" | "Unspecified" = "Unspecified";
  if (lowerText.includes("jams")) disputeForum = "JAMS";
  else if (lowerText.includes("arbitrat")) disputeForum = "Arbitration";
  else if (lowerText.includes("court")) disputeForum = "State/Federal Court";

  // Check whether prevailing party recovers attorney fees
  const feeShifting = lowerText.includes("prevailing party") && lowerText.includes("attorney fees") && !lowerText.includes("not be entitled");

  // Generate plain English executive summary
  let executiveSummary = "";
  if (overallScore >= 75) {
    executiveSummary = `High-Risk Contract Alert: This document contains multiple asymmetric liability terms. Key dangers include aggressive unilateral indemnification and severe limits on your legal recourse. We strongly recommend inserting standard mutual liability caps and negotiating balanced IP protections before signing.`;
  } else if (overallScore >= 45) {
    executiveSummary = `Moderate Risk Agreement: This document is generally workable but contains several unaddressed liabilities such as long non-solicitation periods or vague oral disclosure rules. Adding the suggested remediation clauses will bring it up to institutional market standards.`;
  } else {
    executiveSummary = `Low-Risk / Balanced Agreement: The contract provisions reflect fair commercial terms with mutual protections. No catastrophic indemnity or IP forfeiture risks were detected.`;
  }

  // Return the completed analysis result object
  return {
    documentTitle: title || "Custom Uploaded Contract",
    overallScore,
    executiveSummary,
    estimatedReviewMinutes: Math.max(3, Math.ceil(chunks.length * 1.5)),
    categoryScores,
    clauses: detectedClauses,
    missingSafeguards,
    jurisdiction: {
      detectedJurisdiction,
      enforceabilityNotes: `Governing law identified as ${detectedJurisdiction}. Key dispute resolution forum is set to ${disputeForum}.`,
      disputeForum,
      feeShifting,
    },
  };
}
