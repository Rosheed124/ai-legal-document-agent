// This file defines the shapes of all data objects used across our legal analysis app

// Risk level classification for contract terms
export type RiskLevel = "critical" | "warning" | "low";

// Category of legal clauses commonly scrutinized in enterprise contracts
export type ClauseCategory = 
  | "indemnity"        // Who pays if someone gets sued
  | "liability"        // Maximum damage limits and money caps
  | "intellectual_prop"// Who owns the inventions, code, or copyright
  | "termination"      // How and when either party can cancel the deal
  | "confidentiality"  // Rules around keeping secrets and proprietary info
  | "governing_law";   // Which court or state gets to decide arguments

// Represents an individual clause found within a legal contract
export interface ContractClause {
  // Unique identification code for this specific clause
  id: string;
  // Human-readable title of the legal clause
  title: string;
  // Which category this clause belongs to
  category: ClauseCategory;
  // The level of danger this clause presents to the signer
  riskLevel: RiskLevel;
  // Numeric danger score from 1 (harmless) to 100 (catastrophic liability)
  riskScore: number;
  // The exact sentence or paragraph copied from the contract text
  originalText: string;
  // A friendly plain-English explanation of why this clause is dangerous
  explanation: string;
  // Recommended safe replacement language to protect the client
  suggestedRemediation: string;
  // Whether the user has accepted the recommended fix
  isResolved: boolean;
}

// Represents a safeguard that standard fair contracts always include but might be missing here
export interface MissingSafeguard {
  // Unique identification code for this safeguard
  id: string;
  // Name of the missing legal protection
  title: string;
  // Why having this protection in the contract is important
  importance: string;
  // Standard boilerplate legal text that can be inserted
  standardClause: string;
  // Whether the user chose to insert this missing clause into their draft
  isAdded: boolean;
}

// Represents the overall analysis result for an entire legal document
export interface AnalysisResult {
  // The document title or detected agreement type
  documentTitle: string;
  // Overall composite risk score between 0 (safe) and 100 (extreme danger)
  overallScore: number;
  // Plain-English executive summary summarizing the contract in 2-3 sentences
  executiveSummary: string;
  // Estimated reading and negotiation time in minutes
  estimatedReviewMinutes: number;
  // Breakdown of danger scores for each category
  categoryScores: {
    indemnity: number;
    liability: number;
    intellectual_prop: number;
    termination: number;
    confidentiality: number;
    governing_law: number;
  };
  // List of all extracted clauses with their individual risk ratings
  clauses: ContractClause[];
  // List of standard safeguards that were found missing from the document
  missingSafeguards: MissingSafeguard[];
  // Governing law jurisdiction details
  jurisdiction: {
    detectedJurisdiction: string;
    enforceabilityNotes: string;
    disputeForum: "Arbitration" | "State/Federal Court" | "JAMS" | "Unspecified";
    feeShifting: boolean; // Does the loser pay the winner's legal fees?
  };
}

// Preset contract template that users can load with one click
export interface PresetContract {
  // Identifier key for the preset
  id: string;
  // Display name of the contract type
  name: string;
  // Short subtitle explaining who typically uses this contract
  description: string;
  // The full text of the contract template
  text: string;
  // Default analysis data for instant preview or offline mode
  defaultAnalysis: AnalysisResult;
}
