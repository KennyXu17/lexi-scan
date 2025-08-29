import { ComplianceRule, ScanResult, RuleStatus, ContractAnalysis } from '@/types/compliance';

// Mock LLM responses for different rule types
const mockLLMResponses: Record<string, { rationale: string; suggestions: string[] }> = {
  'liability-cap-1': {
    rationale: 'The contract contains liability limitations but they appear to be one-sided and may not provide adequate mutual protection.',
    suggestions: [
      'Add mutual liability caps that apply to both parties equally',
      'Include carve-outs for certain types of damages (e.g., data breaches, IP infringement)',
      'Ensure liability caps are reasonable in relation to contract value'
    ]
  }
};

class MockScannerService {
  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private scanKeywordRule(text: string, rule: ComplianceRule): ScanResult {
    const matches: ScanResult['matches'] = [];
    const keywords = rule.keywords || [];
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          text: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.9
        });
      }
    });

    const status: RuleStatus = matches.length > 0 ? 'pass' : 'flag';
    
    return {
      ruleId: rule.id,
      status,
      matches,
      rationale: matches.length > 0 
        ? `Found ${matches.length} relevant clause(s) addressing ${rule.title.toLowerCase()}`
        : `No specific clauses found for ${rule.title.toLowerCase()}. This may indicate a compliance gap.`,
      suggestions: matches.length === 0 ? [rule.suggestion] : []
    };
  }

  private scanRegexRule(text: string, rule: ComplianceRule): ScanResult {
    const matches: ScanResult['matches'] = [];
    
    if (rule.pattern) {
      const regex = new RegExp(rule.pattern, 'gi');
      let match;
      
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          text: match[0],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          confidence: 0.85
        });
      }
    }

    const status: RuleStatus = matches.length > 0 ? 'pass' : 'flag';
    
    return {
      ruleId: rule.id,
      status,
      matches,
      rationale: matches.length > 0 
        ? `Pattern matching found ${matches.length} relevant section(s)`
        : `Pattern not found. Consider adding specific clauses for ${rule.title.toLowerCase()}.`,
      suggestions: matches.length === 0 ? [rule.suggestion] : []
    };
  }

  private async scanLLMRule(text: string, rule: ComplianceRule): Promise<ScanResult> {
    // Simulate LLM processing time
    await this.simulateDelay(800);
    
    // Mock LLM analysis
    const mockResponse = mockLLMResponses[rule.id];
    
    if (mockResponse) {
      // Find some text to highlight (simplified matching)
      const searchTerms = ['liability', 'limitation', 'limit', 'damages', 'exceed'];
      const matches: ScanResult['matches'] = [];
      
      searchTerms.forEach(term => {
        const regex = new RegExp(`\\b\\w*${term}\\w*\\b`, 'gi');
        let match;
        
        while ((match = regex.exec(text)) !== null) {
          matches.push({
            text: match[0],
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            confidence: 0.75
          });
        }
      });

      return {
        ruleId: rule.id,
        status: matches.length > 0 ? 'flag' : 'fail',
        matches,
        rationale: mockResponse.rationale,
        suggestions: mockResponse.suggestions
      };
    }

    return {
      ruleId: rule.id,
      status: 'flag',
      matches: [],
      rationale: `LLM analysis indicates potential compliance concerns with ${rule.title.toLowerCase()}`,
      suggestions: [rule.suggestion]
    };
  }

  async scanContract(text: string, rules: ComplianceRule[]): Promise<ContractAnalysis> {
    const enabledRules = rules.filter(rule => rule.enabled);
    const results: ScanResult[] = [];

    // Process rules in parallel where possible
    const scanPromises = enabledRules.map(async (rule) => {
      switch (rule.type) {
        case 'keyword':
          return this.scanKeywordRule(text, rule);
        case 'regex':
          return this.scanRegexRule(text, rule);
        case 'llm':
          return await this.scanLLMRule(text, rule);
        default:
          throw new Error(`Unknown rule type: ${rule.type}`);
      }
    });

    const scanResults = await Promise.all(scanPromises);
    results.push(...scanResults);

    // Calculate overall score
    const severityWeights = { critical: 4, high: 3, medium: 2, low: 1 };
    const statusWeights = { pass: 1, flag: 0.5, fail: 0 };
    
    let totalWeight = 0;
    let achievedScore = 0;

    enabledRules.forEach((rule, index) => {
      const weight = severityWeights[rule.severity];
      const result = results[index];
      const statusScore = statusWeights[result.status];
      
      totalWeight += weight;
      achievedScore += weight * statusScore;
    });

    const overallScore = totalWeight > 0 ? Math.round((achievedScore / totalWeight) * 100) : 0;

    // Calculate summary
    const summary = {
      totalRules: enabledRules.length,
      passedRules: results.filter(r => r.status === 'pass').length,
      flaggedRules: results.filter(r => r.status === 'flag').length,
      failedRules: results.filter(r => r.status === 'fail').length
    };

    return {
      contractText: text,
      results,
      overallScore,
      timestamp: new Date(),
      summary
    };
  }
}

export const mockScanner = new MockScannerService();