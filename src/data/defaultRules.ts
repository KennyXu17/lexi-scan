import { ComplianceRule } from '@/types/compliance';

export const defaultComplianceRules: ComplianceRule[] = [
  {
    id: 'privacy-1',
    title: 'Data Protection Clause',
    category: 'Privacy & Data Protection',
    severity: 'critical',
    type: 'keyword',
    keywords: ['personal data', 'privacy policy', 'data protection', 'GDPR', 'data processing'],
    explanation: 'Contracts must include adequate data protection provisions',
    suggestion: 'Add comprehensive data protection clauses covering collection, processing, and storage of personal data',
    examples: ['The parties shall comply with all applicable data protection laws', 'Personal data will be processed in accordance with GDPR'],
    enabled: true
  },
  {
    id: 'privacy-2',
    title: 'Data Transfer Restrictions',
    category: 'Privacy & Data Protection',
    severity: 'high',
    type: 'regex',
    pattern: '(cross.?border|international.?transfer|third.?countr)',
    explanation: 'International data transfers must be properly regulated',
    suggestion: 'Include specific provisions for international data transfers with appropriate safeguards',
    examples: ['Data transfers outside the EU require adequate protection measures'],
    enabled: true
  },
  {
    id: 'ip-1',
    title: 'Intellectual Property Rights',
    category: 'Intellectual Property',
    severity: 'high',
    type: 'keyword',
    keywords: ['intellectual property', 'IP rights', 'copyrights', 'trademarks', 'patents', 'proprietary information'],
    explanation: 'Clear IP ownership and usage rights must be established',
    suggestion: 'Define IP ownership, licensing terms, and usage restrictions clearly',
    examples: ['All IP rights remain with the original owner', 'License granted is non-exclusive and revocable'],
    enabled: true
  },
  {
    id: 'indemnification-1',
    title: 'Indemnification Provisions',
    category: 'Risk & Liability',
    severity: 'critical',
    type: 'keyword',
    keywords: ['indemnify', 'indemnification', 'hold harmless', 'defend'],
    explanation: 'Indemnification clauses protect against third-party claims',
    suggestion: 'Include mutual indemnification provisions with reasonable caps and exclusions',
    examples: ['Each party shall indemnify the other against third-party claims'],
    enabled: true
  },
  {
    id: 'termination-1',
    title: 'Termination Rights',
    category: 'Contract Terms',
    severity: 'medium',
    type: 'keyword',
    keywords: ['termination', 'terminate', 'end agreement', 'cancel', 'breach'],
    explanation: 'Clear termination procedures and rights must be defined',
    suggestion: 'Specify termination triggers, notice periods, and post-termination obligations',
    examples: ['Either party may terminate with 30 days written notice', 'Termination for material breach after cure period'],
    enabled: true
  },
  {
    id: 'sla-1',
    title: 'Service Level Agreement',
    category: 'Performance Standards',
    severity: 'medium',
    type: 'regex',
    pattern: '(uptime|availability|performance.?standard|service.?level|SLA)',
    explanation: 'Service levels and performance standards should be clearly defined',
    suggestion: 'Include specific, measurable SLA requirements with remedies for non-compliance',
    examples: ['99.9% uptime guarantee with service credits for downtime'],
    enabled: true
  },
  {
    id: 'governing-law-1',
    title: 'Governing Law & Jurisdiction',
    category: 'Legal Framework',
    severity: 'low',
    type: 'keyword',
    keywords: ['governing law', 'jurisdiction', 'applicable law', 'disputes', 'arbitration', 'court'],
    explanation: 'Legal framework for dispute resolution must be established',
    suggestion: 'Specify governing law and dispute resolution mechanisms',
    examples: ['This agreement shall be governed by the laws of [State/Country]'],
    enabled: true
  },
  {
    id: 'liability-cap-1',
    title: 'Liability Limitations',
    category: 'Risk & Liability',
    severity: 'high',
    type: 'llm',
    explanation: 'Liability caps and exclusions should be reasonable and mutual',
    suggestion: 'Include mutual liability caps with carve-outs for certain types of damages',
    examples: ['Total liability limited to fees paid in the preceding 12 months'],
    enabled: true
  }
];