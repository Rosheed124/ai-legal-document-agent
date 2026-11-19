// Import testing utilities from Vitest
import { describe, expect, it } from "vitest";
// Import our contract analysis functions
import { analyzeContract, tokenizeClauses } from "./analyzer";
// Import the preset contracts to test against
import { PRESET_CONTRACTS } from "./presets";

// Group of tests covering the contract tokenization engine
describe("Clause Tokenizer Engine", () => {
  // Test that a multi-paragraph contract is correctly split into discrete chunks
  it("splits text into individual paragraphs when separated by double newlines", () => {
    // Sample test document with two clear paragraphs
    const sampleText = "Paragraph 1: Vendor grants access to software.\n\nParagraph 2: Customer agrees to pay fees.";
    // Run the tokenizer
    const chunks = tokenizeClauses(sampleText);
    // Expect 2 distinct paragraphs to be extracted
    expect(chunks.length).toBe(2);
    // Verify first chunk text
    expect(chunks[0]).toContain("Paragraph 1");
    // Verify second chunk text
    expect(chunks[1]).toContain("Paragraph 2");
  });

  // Test that tiny useless strings (like lone punctuation) are discarded
  it("filters out short non-meaningful text fragments", () => {
    // Text with tiny scraps between paragraphs
    const noisyText = "Short\n\n\n\nValid legal sentence with sufficient length to be a clause.\n\n.";
    // Run the tokenizer
    const chunks = tokenizeClauses(noisyText);
    // Only the real paragraph should remain
    expect(chunks.length).toBe(1);
    // Verify it is the meaningful sentence
    expect(chunks[0]).toContain("Valid legal sentence");
  });
});

// Group of tests covering the risk analyzer and scoring logic
describe("Risk Analyzer Engine", () => {
  // Test that high-risk indemnification is flagged correctly
  it("flags unilateral indemnity as a critical liability risk", () => {
    // Dangerous indemnity language
    const indemnitySnippet = "Customer shall defend, indemnify, and hold harmless Vendor from all third-party claims.";
    // Analyze the snippet
    const result = analyzeContract(indemnitySnippet, "Test Indemnity");
    // Should flag at least one clause
    expect(result.clauses.length).toBeGreaterThan(0);
    // The flagged clause should be critical
    expect(result.clauses[0].riskLevel).toBe("critical");
    // The category must be indemnity
    expect(result.clauses[0].category).toBe("indemnity");
    // Overall score should reflect danger
    expect(result.overallScore).toBeGreaterThan(50);
  });

  // Test that preset contracts load with accurate analysis
  it("analyzes the Enterprise SaaS preset with a high danger rating", () => {
    // Get the SaaS MSA preset
    const saasPreset = PRESET_CONTRACTS.find((p) => p.id === "saas-msa");
    // Ensure preset exists
    expect(saasPreset).toBeDefined();
    // Run live analysis on the preset text
    const liveResult = analyzeContract(saasPreset!.text, saasPreset!.name);
    // Expect high risk score
    expect(liveResult.overallScore).toBeGreaterThan(70);
    // Expect jurisdiction to be Delaware
    expect(liveResult.jurisdiction.detectedJurisdiction).toContain("Delaware");
  });

  // Test detection of missing safeguards
  it("detects missing standard safeguards like data deletion and SLA", () => {
    // Bare contract text with no SLA or deletion rules
    const bareContract = "This is a basic service agreement with no special terms.";
    // Analyze the bare contract
    const result = analyzeContract(bareContract, "Bare Agreement");
    // Should identify missing safeguards
    expect(result.missingSafeguards.length).toBeGreaterThan(0);
    // Verify the SLA safeguard is listed among the missing items
    const hasSla = result.missingSafeguards.some((s) => s.title.includes("Liability Cap"));
    // Expect true
    expect(hasSla).toBe(true);
  });
});
