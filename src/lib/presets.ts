// Import data types for presets and analysis results
import { PresetContract } from "./types";

// Collection of real-world legal contract templates with pre-computed analysis
export const PRESET_CONTRACTS: PresetContract[] = [
  {
    // Unique identifier for the Enterprise SaaS Agreement
    id: "saas-msa",
    // Title shown in the preset switcher
    name: "Enterprise SaaS Master Services Agreement",
    // Friendly description of who uses this contract
    description: "Standard B2B Cloud Software Agreement heavily skewed in favor of the vendor.",
    // The actual raw legal text
    text: `MASTER SERVICES AGREEMENT (SaaS)

1. SERVICES AND ACCESS
Subject to Customer's payment of all applicable Fees, Vendor grants Customer a non-exclusive, non-transferable right to access the Cloud Services during the Term solely for Customer's internal business operations.

2. INTELLECTUAL PROPERTY & DATA RIGHTS
Vendor exclusively retains all right, title, and interest in and to the Cloud Services, including all improvements, modifications, and derivative works. Customer grants Vendor a perpetual, irrevocable, worldwide, royalty-free license to ingest, store, copy, and utilize Customer Data and usage metrics to train, improve, fine-tune, and commercially exploit Vendor's machine learning models and artificial intelligence systems without compensation or attribution.

3. INDEMNIFICATION (UNILATERAL)
Customer shall defend, indemnify, and hold harmless Vendor, its parent companies, affiliates, directors, and officers from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorney fees) arising out of or related to: (a) Customer Data; (b) Customer's breach of this Agreement; or (c) any third-party claim alleging that Customer's use of the Services violates applicable law. Vendor shall have no obligation to defend or indemnify Customer for intellectual property infringement or service failures.

4. LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL VENDOR BE LIABLE FOR ANY INDIRECT, PUNITIVE, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION). VENDOR'S TOTAL AGGREGATE LIABILITY ARISING UNDER THIS AGREEMENT SHALL BE STRICTLY LIMITED TO ONE HUNDRED DOLLARS ($100.00 USD), NOTWITHSTANDING THE FAILURE OF ESSENTIAL PURPOSE OF ANY REMEDY. THIS LIMITATION APPLIES EVEN IF VENDOR WAS ADVISED OF THE POSSIBILITY OF SUCH LOSS. CUSTOMER'S LIABILITY UNDER SECTION 3 SHALL REMAIN ENTIRELY UNCAPPED.

5. TERM AND AUTOMATIC RENEWAL
This Agreement shall commence on the Effective Date and continue for an initial term of twelve (12) months. Thereafter, this Agreement shall automatically renew for successive twelve-month periods at a mandatory 15% price increase unless Customer provides written notice of non-renewal at least ninety (90) calendar days prior to the expiration of the then-current term. Notice must be sent via registered certified physical mail to Vendor's registered agent.

6. GOVERNING LAW AND EXCLUSIVE DISPUTE RESOLUTION
This Agreement is governed by the laws of the State of Delaware, USA, without regard to conflict of law rules. Any dispute arising out of or relating to this Agreement must be submitted to confidential, binding individual arbitration administered by JAMS in Wilmington, Delaware. Customer explicitly waives any constitutional right to a jury trial or to participate in any class action litigation. The prevailing party shall NOT be entitled to recover attorney fees from the losing party.`,
    // Pre-calculated analysis data for fast instant demonstration
    defaultAnalysis: {
      documentTitle: "Enterprise SaaS Master Services Agreement",
      overallScore: 84, // Very high risk document!
      executiveSummary: "This SaaS Agreement is severely one-sided in favor of the Vendor. It forces the Customer to surrender perpetual AI training rights over proprietary company data, imposes uncapped unilateral indemnification on the Customer while capping Vendor liability at an absurd $100, and hides a strict 90-day auto-renewal price trap.",
      estimatedReviewMinutes: 8,
      categoryScores: {
        indemnity: 95,
        liability: 92,
        intellectual_prop: 88,
        termination: 75,
        confidentiality: 60,
        governing_law: 70,
      },
      clauses: [
        {
          id: "clause-saas-1",
          title: "Unilateral Customer Indemnity",
          category: "indemnity",
          riskLevel: "critical",
          riskScore: 95,
          originalText: "Customer shall defend, indemnify, and hold harmless Vendor... Vendor shall have no obligation to defend or indemnify Customer for intellectual property infringement or service failures.",
          explanation: "You are agreeing to pay all legal bills and damages if someone sues the Vendor, but the Vendor gives you zero legal protection if their software infringes someone else's patent or copyright.",
          suggestedRemediation: "Each party shall mutually defend and indemnify the other against third-party claims arising from gross negligence, willful misconduct, or intellectual property infringement of their respective deliverables.",
          isResolved: false,
        },
        {
          id: "clause-saas-2",
          title: "Asymmetric $100 Liability Cap",
          category: "liability",
          riskLevel: "critical",
          riskScore: 92,
          originalText: "VENDOR'S TOTAL AGGREGATE LIABILITY ARISING UNDER THIS AGREEMENT SHALL BE STRICTLY LIMITED TO ONE HUNDRED DOLLARS ($100.00 USD)... CUSTOMER'S LIABILITY UNDER SECTION 3 SHALL REMAIN ENTIRELY UNCAPPED.",
          explanation: "If the Vendor leaks all your confidential customer data or destroys your business operations, you can only recover a maximum of $100. Meanwhile, your own potential liability has no ceiling.",
          suggestedRemediation: "Except for breaches of confidentiality and IP indemnity, each party's total aggregate liability under this Agreement shall be capped at the total fees paid or payable by Customer in the preceding twelve (12) months.",
          isResolved: false,
        },
        {
          id: "clause-saas-3",
          title: "Perpetual AI Model Ingestion of Customer Data",
          category: "intellectual_prop",
          riskLevel: "critical",
          riskScore: 88,
          originalText: "Customer grants Vendor a perpetual, irrevocable, worldwide, royalty-free license to ingest, store, copy, and utilize Customer Data... to train, improve, fine-tune, and commercially exploit Vendor's machine learning models.",
          explanation: "The Vendor is taking ownership rights over your confidential business data and using it to train AI models that could even benefit your direct competitors.",
          suggestedRemediation: "Customer retains all right, title, and interest in Customer Data. Vendor shall NOT use Customer Data to train, fine-tune, or develop any machine learning or artificial intelligence models without Customer's prior written consent.",
          isResolved: false,
        },
        {
          id: "clause-saas-4",
          title: "90-Day Auto-Renewal with 15% Price Hike",
          category: "termination",
          riskLevel: "warning",
          riskScore: 75,
          originalText: "...automatically renew for successive twelve-month periods at a mandatory 15% price increase unless Customer provides written notice of non-renewal at least ninety (90) calendar days prior... sent via registered certified physical mail.",
          explanation: "You must cancel a full 3 months before your contract expires, and you must use old-fashioned certified mail, or else you are locked in for another full year with a 15% price hike.",
          suggestedRemediation: "Agreement may renew only upon mutual written agreement, or upon thirty (30) days advance notice with annual fee increases capped at the Consumer Price Index (CPI) up to a maximum of 3%.",
          isResolved: false,
        },
        {
          id: "clause-saas-5",
          title: "Mandatory Delaware Arbitration with Class Action Waiver",
          category: "governing_law",
          riskLevel: "warning",
          riskScore: 70,
          originalText: "Any dispute... must be submitted to confidential, binding individual arbitration administered by JAMS in Wilmington, Delaware. Customer explicitly waives any constitutional right to a jury trial... The prevailing party shall NOT be entitled to recover attorney fees.",
          explanation: "You give up your right to go to a normal court or jury, and must travel to Delaware for private arbitration. Because winning doesn't let you recover legal fees, fighting a valid small claim is financially pointless.",
          suggestedRemediation: "Disputes shall be resolved in courts of competent jurisdiction located in the Customer's home territory. The prevailing party in any legal action shall be entitled to recover reasonable attorney fees and court costs.",
          isResolved: false,
        },
      ],
      missingSafeguards: [
        {
          id: "missing-1",
          title: "Service Level Agreement (SLA) & Uptime Guarantee",
          importance: "Without an SLA, the vendor can have frequent outages with zero penalties, refunds, or service credits.",
          standardClause: "Vendor warrants that the Cloud Services will maintain a monthly uptime of at least 99.9%. If uptime falls below 99.9%, Customer shall receive prorated service fee credits.",
          isAdded: false,
        },
        {
          id: "missing-2",
          title: "Data Deletion & Return Upon Termination",
          importance: "Without this covenant, the vendor is not legally required to delete or return your data when the contract ends.",
          standardClause: "Within thirty (30) days following termination, Vendor shall permanently delete all Customer Data and provide written certification of such destruction.",
          isAdded: false,
        },
        {
          id: "missing-3",
          title: "Mutual Exclusion of Consequential Damages",
          importance: "Protects both companies equally from indirect, speculative financial losses.",
          standardClause: "Neither party shall be liable to the other for indirect, incidental, consequential, or punitive damages arising out of or related to this Agreement.",
          isAdded: false,
        },
      ],
      jurisdiction: {
        detectedJurisdiction: "Delaware, United States",
        enforceabilityNotes: "Standard commercial venue highly favorable to corporations. Mandatory arbitration and jury waivers are generally enforceable under the Federal Arbitration Act (FAA).",
        disputeForum: "Arbitration",
        feeShifting: false,
      },
    },
  },
  {
    // Unique identifier for Mutual NDA
    id: "mutual-nda",
    // Title shown in switcher
    name: "Mutual Non-Disclosure Agreement (NDA)",
    // Description
    description: "Standard bilateral confidentiality agreement containing subtle non-solicitation and perpetual survival traps.",
    // Raw contract text
    text: `MUTUAL NON-DISCLOSURE AGREEMENT

1. PURPOSE
The parties wish to explore a potential business relationship or transaction ("Permitted Purpose") and may disclose proprietary information.

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any and all information disclosed by Disclosing Party to Receiving Party, whether orally, visually, in writing, electronically, or otherwise, whether marked as confidential or not, including but not limited to business plans, customer lists, market studies, software source code, financial models, and any ideas discussed during informal meetings.

3. OBLIGATIONS OF RECEIVING PARTY
Receiving Party agrees to protect Confidential Information with the same degree of care it uses for its own confidential information, but in no event less than reasonable care. Receiving Party shall not use Confidential Information for any purpose other than the Permitted Purpose.

4. SURVIVAL DURATION
The obligations of non-disclosure and non-use under this Agreement shall survive the termination or expiration of this Agreement in perpetuity and shall bind the parties, their successors, and assigns indefinitely.

5. NON-SOLICITATION OF PERSONNEL
During the term of this Agreement and for a period of twenty-four (24) months following termination, Receiving Party covenants and agrees that it shall not, directly or indirectly, solicit, recruit, hire, or attempt to hire any officer, employee, contractor, or consultant of Disclosing Party.

6. GOVERNING LAW AND INJUNCTIVE RELIEF
This Agreement shall be governed by the laws of England and Wales. Receiving Party acknowledges that a breach would cause irreparable harm for which monetary damages alone would be inadequate, and Disclosing Party shall be entitled to seek immediate preliminary injunctive relief in any court without posting bond.`,
    // Pre-calculated analysis
    defaultAnalysis: {
      documentTitle: "Mutual Non-Disclosure Agreement (NDA)",
      overallScore: 58,
      executiveSummary: "While framed as a standard mutual NDA, this document contains an overly broad oral disclosure definition without confirmation requirements, an onerous perpetual survival timeline, and an aggressive 24-month non-solicitation clause hidden inside what should be a simple confidentiality contract.",
      estimatedReviewMinutes: 5,
      categoryScores: {
        indemnity: 10,
        liability: 40,
        intellectual_prop: 50,
        termination: 65,
        confidentiality: 82,
        governing_law: 45,
      },
      clauses: [
        {
          id: "clause-nda-1",
          title: "Vague Oral Disclosure Definition",
          category: "confidentiality",
          riskLevel: "warning",
          riskScore: 72,
          originalText: "\"Confidential Information\" means any and all information disclosed... whether orally, visually, in writing... whether marked as confidential or not... and any ideas discussed during informal meetings.",
          explanation: "Anything anyone says over casual coffee or on a phone call could be claimed as confidential later, even without written proof or timestamps.",
          suggestedRemediation: "Oral disclosures must be identified as confidential at the time of disclosure and summarized in writing within thirty (30) days to remain protected as Confidential Information.",
          isResolved: false,
        },
        {
          id: "clause-nda-2",
          title: "Perpetual Survival of Secrecy Obligations",
          category: "confidentiality",
          riskLevel: "critical",
          riskScore: 82,
          originalText: "The obligations of non-disclosure and non-use under this Agreement shall survive the termination or expiration of this Agreement in perpetuity and shall bind the parties... indefinitely.",
          explanation: "Standard NDAs expire after 2 to 3 years. A perpetual agreement forces your company to keep track of ordinary business secrets forever, creating permanent legal exposure.",
          suggestedRemediation: "The obligations of confidentiality shall expire three (3) years from the date of disclosure, except for bona fide trade secrets which shall remain protected for as long as they qualify as trade secrets under applicable law.",
          isResolved: false,
        },
        {
          id: "clause-nda-3",
          title: "Sneaky 24-Month Non-Solicitation Covenant",
          category: "termination",
          riskLevel: "warning",
          riskScore: 68,
          originalText: "...Receiving Party covenants and agrees that it shall not, directly or indirectly, solicit, recruit, hire, or attempt to hire any officer, employee, contractor, or consultant of Disclosing Party.",
          explanation: "This is a non-disclosure agreement, not an employment agreement. Tucking an employee hiring ban into an NDA prevents you from hiring talented people who apply through open job postings.",
          suggestedRemediation: "Delete the non-solicitation clause entirely, or narrow it to specifically prohibit targeted poaching of personnel directly introduced during confidential discussions.",
          isResolved: false,
        },
      ],
      missingSafeguards: [
        {
          id: "missing-nda-1",
          title: "Standard Exclusions from Confidentiality",
          importance: "Without clear exceptions (public knowledge, already known, independently developed), normal business operations become risky.",
          standardClause: "Confidential Information does not include information that: (a) is or becomes publicly known without breach; (b) was already known to Receiving Party prior to disclosure; (c) is independently developed without reference to the disclosed information; or (d) is required to be disclosed by law or court order.",
          isAdded: false,
        },
        {
          id: "missing-nda-2",
          title: "Defend Trade Secrets Act (DTSA) Whistleblower Notice",
          importance: "Required by US federal law for immunity provisions in non-disclosure agreements involving trade secrets.",
          standardClause: "Pursuant to 18 U.S.C. § 1833(b), an individual shall not be held criminally or civilly liable under any federal or state trade secret law for disclosure of a trade secret made in confidence to a government official or attorney solely for reporting or investigating a suspected violation of law.",
          isAdded: false,
        },
      ],
      jurisdiction: {
        detectedJurisdiction: "England and Wales",
        enforceabilityNotes: "English courts recognize bilateral NDAs, but perpetual clauses and broad employee non-solicit covenants are subject to reasonableness scrutiny under common law restraint of trade doctrine.",
        disputeForum: "State/Federal Court",
        feeShifting: true,
      },
    },
  },
  {
    // Unique identifier for Employment Agreement
    id: "employment-piia",
    // Title
    name: "Employee Proprietary Information & Inventions (PIIA)",
    // Description
    description: "Startup employment covenant assigning all weekend projects, inventions, and moral rights to the employer.",
    // Text
    text: `PROPRIETARY INFORMATION AND INVENTIONS AGREEMENT (PIIA)

1. RECOGNITION OF FULL-TIME SERVICE
Employee agrees to devote full working time and undivided loyalty to the Company.

2. COMPREHENSIVE ASSIGNMENT OF INVENTIONS
Employee hereby assigns and agrees to assign irrevocably to the Company all right, title, and interest worldwide in and to any and all inventions, designs, computer programs, algorithms, discoveries, and ideas (whether patentable or not), developed, conceived, or reduced to practice by Employee solely or jointly with others, during the entire period of employment, whether or not conceived during normal working hours, on Company premises, or using Company equipment, and whether or not related to Company's current or prospective business.

3. WAIVER OF MORAL RIGHTS
To the greatest extent permitted by applicable law, Employee irrevocably waives all moral rights, rights of paternity, rights of integrity, and rights of attribution in any works of authorship created during employment.

4. POST-EMPLOYMENT NON-COMPETE COVENANT
For twelve (12) months following termination of employment for any reason, Employee shall not directly or indirectly engage in, advise, invest in, or provide services to any entity, company, or venture that competes with any product or service offered or actively planned by Company worldwide.`,
    // Pre-calculated analysis
    defaultAnalysis: {
      documentTitle: "Employee Proprietary Information & Inventions (PIIA)",
      overallScore: 89,
      executiveSummary: "This employee agreement contains extreme overreaches: it seizes personal weekend projects created on private laptops, demands total waiver of creator moral rights, and includes a post-employment worldwide non-compete covenant that is actively unenforceable in many modern jurisdictions.",
      estimatedReviewMinutes: 6,
      categoryScores: {
        indemnity: 0,
        liability: 30,
        intellectual_prop: 96,
        termination: 85,
        confidentiality: 60,
        governing_law: 65,
      },
      clauses: [
        {
          id: "clause-emp-1",
          title: "Total IP Capture of Personal Inventions",
          category: "intellectual_prop",
          riskLevel: "critical",
          riskScore: 96,
          originalText: "...any and all inventions, designs, computer programs... developed, conceived, or reduced to practice... whether or not conceived during normal working hours, on Company premises, or using Company equipment, and whether or not related to Company's current or prospective business.",
          explanation: "The company claims full ownership of any code, game, mobile app, or novel you write on your own personal computer on Sunday nights, even if it has nothing to do with your job.",
          suggestedRemediation: "Employee assigns only inventions developed: (a) during working hours; (b) using Company equipment or facilities; or (c) directly relating to the Company's actual current business or proven research and development.",
          isResolved: false,
        },
        {
          id: "clause-emp-2",
          title: "Worldwide 12-Month Non-Compete Restriction",
          category: "termination",
          riskLevel: "critical",
          riskScore: 85,
          originalText: "...shall not directly or indirectly engage in, advise, invest in, or provide services to any entity... that competes with any product or service offered or actively planned by Company worldwide.",
          explanation: "This prevents you from working for any competitor in the world for an entire year after leaving, potentially blocking you from earning a living in your professional field.",
          suggestedRemediation: "Remove the non-compete covenant entirely to comply with modern labor standards (e.g., California Labor Code § 16600, UK CMA guidance), relying instead on robust protection of proprietary trade secrets.",
          isResolved: false,
        },
      ],
      missingSafeguards: [
        {
          id: "missing-emp-1",
          title: "Schedule of Prior Inventions Carveout",
          importance: "Without a prior inventions schedule, the company can claim that code or software you wrote before being hired belongs to them.",
          standardClause: "Attached as Exhibit A is a complete list of all prior inventions, software, and intellectual property owned by Employee before joining the Company, which are explicitly excluded from this Agreement.",
          isAdded: false,
        },
        {
          id: "missing-emp-2",
          title: "Statutory Labor Code Invention Exemption Notice",
          importance: "Mandatory in states like California, Washington, and Minnesota to notify employees of their legal rights to personal inventions.",
          standardClause: "Notice is hereby given that this Agreement does not apply to any invention for which no equipment, supplies, facility, or trade secret information of the employer was used and which was developed entirely on the employee's own time.",
          isAdded: false,
        },
      ],
      jurisdiction: {
        detectedJurisdiction: "General Employment Jurisdiction",
        enforceabilityNotes: "Broad non-competes are void as a matter of law in jurisdictions like California, Minnesota, and Ontario. Overbroad assignment of unrelated personal inventions violates statutory protections.",
        disputeForum: "State/Federal Court",
        feeShifting: false,
      },
    },
  },
  {
    // Unique identifier for Contractor Agreement
    id: "contractor-msa",
    // Title
    name: "Independent Contractor Consulting Agreement",
    // Description
    description: "Consultant engagement contract with Net-90 payment terms and unilateral cancellation rights.",
    // Text
    text: `INDEPENDENT CONTRACTOR CONSULTING AGREEMENT

1. SCOPE OF SERVICES
Contractor shall perform software architecture and technical advisory services as directed by Client from time to time.

2. COMPENSATION AND PAYMENT TERMS
Client shall pay Contractor the agreed hourly rate within ninety (90) business days following receipt and verified approval of Contractor's invoice. Client reserves the unilateral right to withhold, discount, or cancel payment if Client in its sole discretion deems any deliverable incomplete or unsatisfactory.

3. TERMINATION FOR CONVENIENCE
Client may terminate this Agreement at any time, with or without cause, immediately upon verbal or written notice to Contractor. Upon such termination, Client shall have no obligation to pay Contractor for any work in progress, unapproved hours, or incurred expenses.

4. WORK FOR HIRE AND ASSIGNMENT
All deliverables, work product, notes, diagrams, and preliminary drafts prepared by Contractor shall be deemed "work made for hire" for Client. If any such work product does not qualify as work made for hire, Contractor unconditionally assigns all worldwide copyright and patent rights to Client.

5. CONTRACTOR INDEMNIFICATION
Contractor shall defend, indemnify, and hold harmless Client from any and all damages, claims, costs, or losses arising from Contractor's performance of services, including any third-party claims or tax reclassification liabilities.`,
    // Pre-calculated analysis
    defaultAnalysis: {
      documentTitle: "Independent Contractor Consulting Agreement",
      overallScore: 78,
      executiveSummary: "This agreement exposes the independent contractor to severe financial and legal risk: it allows the client to wait 90+ business days to pay, gives the client unilateral power to cancel the contract without paying for work already completed, and imposes full tax indemnity onto the contractor.",
      estimatedReviewMinutes: 5,
      categoryScores: {
        indemnity: 88,
        liability: 70,
        intellectual_prop: 65,
        termination: 90,
        confidentiality: 35,
        governing_law: 50,
      },
      clauses: [
        {
          id: "clause-con-1",
          title: "Net-90 Payment Delay with Subjective Discretion",
          category: "liability",
          riskLevel: "critical",
          riskScore: 84,
          originalText: "Client shall pay Contractor... within ninety (90) business days... reserves the unilateral right to withhold, discount, or cancel payment if Client in its sole discretion deems any deliverable incomplete...",
          explanation: "You could work for months and wait up to 4 months to get paid, only for the client to decide on their own whim that they don't want to pay you.",
          suggestedRemediation: "Client shall pay undisputed invoices within thirty (30) days of receipt. Invoices not disputed in writing with reasonable specificity within ten (10) business days shall be deemed accepted.",
          isResolved: false,
        },
        {
          id: "clause-con-2",
          title: "Immediate Termination Without Pay for Work in Progress",
          category: "termination",
          riskLevel: "critical",
          riskScore: 90,
          originalText: "Client may terminate this Agreement at any time, with or without cause, immediately... Client shall have no obligation to pay Contractor for any work in progress, unapproved hours, or incurred expenses.",
          explanation: "The client can fire you right before you finish a massive project and legally refuse to pay you for all the hours you already invested.",
          suggestedRemediation: "Either party may terminate for convenience upon fourteen (14) days prior written notice. Upon termination, Client shall promptly pay Contractor for all services performed and approved expenses incurred up to the effective termination date.",
          isResolved: false,
        },
      ],
      missingSafeguards: [
        {
          id: "missing-con-1",
          title: "IP Retention Pending Full Payment",
          importance: "Guarantees that intellectual property does not transfer to the client until you have actually received payment in your bank account.",
          standardClause: "Transfer of ownership in deliverables is expressly conditioned upon Contractor's receipt of full payment of all corresponding fees.",
          isAdded: false,
        },
        {
          id: "missing-con-2",
          title: "Late Payment Interest & Collection Costs",
          importance: "Incentivizes the client to pay on time and reimburses you if you have to chase unpaid invoices.",
          standardClause: "Late payments shall accrue interest at the rate of 1.5% per month or the highest legal rate, plus all reasonable collection costs and attorney fees.",
          isAdded: false,
        },
      ],
      jurisdiction: {
        detectedJurisdiction: "Commercial Contract Jurisdiction",
        enforceabilityNotes: "Subject to independent contractor classification rules (e.g., ABC test). One-sided forfeiture of pay for performed work may be struck down under unjust enrichment principles.",
        disputeForum: "State/Federal Court",
        feeShifting: false,
      },
    },
  },
];
