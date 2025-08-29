export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type RuleType = 'keyword' | 'regex' | 'llm';
export type RuleStatus = 'pass' | 'flag' | 'fail';

export interface ComplianceRule {
  id: string;
  title: string;
  category: string;
  severity: SeverityLevel;
  type: RuleType;
  pattern?: string;
  keywords?: string[];
  explanation: string;
  suggestion: string;
  examples: string[];
  enabled: boolean;
}

export interface ScanResult {
  ruleId: string;
  status: RuleStatus;
  matches: Array<{
    text: string;
    startIndex: number;
    endIndex: number;
    confidence: number;
  }>;
  rationale: string;
  suggestions: string[];
}

export interface ContractAnalysis {
  contractText: string;
  results: ScanResult[];
  overallScore: number;
  timestamp: Date;
  summary: {
    totalRules: number;
    passedRules: number;
    flaggedRules: number;
    failedRules: number;
  };
}

export interface FilterOptions {
  severity: SeverityLevel[];
  status: RuleStatus[];
  category: string[];
}