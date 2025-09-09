import { ComplianceRule } from '@/types/compliance';

export interface ComplianceTemplate {
  name: string;
  rules: ComplianceRule[];
}

export const complianceTemplates: ComplianceTemplate[] = [
  {
    name: 'General Purpose Checklist',
    rules: [
      {
        id: 'privacy-1',
        title: 'Data Protection Clause',
        category: 'Privacy & Data Protection',
        severity: 'critical',
        type: 'keyword',
        keywords: ['personal data', 'privacy policy', 'data protection', 'GDPR', 'data processing'],
        explanation: 'Contracts must include adequate data protection provisions',
        suggestion: 'Add comprehensive data protection clauses covering collection, processing, and storage of personal data.',
        examples: ['The parties shall comply with all applicable data protection laws.'],
        enabled: true
      },
      {
        id: 'ip-1',
        title: 'Intellectual Property Rights',
        category: 'Intellectual Property',
        severity: 'high',
        type: 'keyword',
        keywords: ['intellectual property', 'IP rights', 'copyrights', 'trademarks', 'patents'],
        explanation: 'Clear IP ownership and usage rights must be established.',
        suggestion: 'Define IP ownership, licensing terms, and usage restrictions clearly.',
        examples: ['All IP rights remain with the original owner.'],
        enabled: true
      },
      {
        id: 'indemnification-1',
        title: 'Indemnification Provisions',
        category: 'Risk & Liability',
        severity: 'critical',
        type: 'keyword',
        keywords: ['indemnify', 'indemnification', 'hold harmless'],
        explanation: 'Indemnification clauses protect against third-party claims.',
        suggestion: 'Include mutual indemnification provisions with reasonable caps and exclusions.',
        examples: ['Each party shall indemnify the other against third-party claims.'],
        enabled: true
      },
      {
        id: 'termination-1',
        title: 'Termination Rights',
        category: 'Contract Terms',
        severity: 'medium',
        type: 'keyword',
        keywords: ['termination', 'terminate', 'cancel', 'breach'],
        explanation: 'Clear termination procedures and rights must be defined.',
        suggestion: 'Specify termination triggers, notice periods, and post-termination obligations.',
        examples: ['Either party may terminate with 30 days written notice.'],
        enabled: true
      },
      {
        id: 'governing-law-1',
        title: 'Governing Law & Jurisdiction',
        category: 'Legal Framework',
        severity: 'low',
        type: 'keyword',
        keywords: ['governing law', 'jurisdiction', 'disputes', 'arbitration'],
        explanation: 'Legal framework for dispute resolution must be established.',
        suggestion: 'Specify governing law and dispute resolution mechanisms.',
        examples: ['This agreement shall be governed by the laws of [State/Country].'],
        enabled: true
      }
    ]
  },
  {
    name: 'SaaS Agreement Checklist',
    rules: [
      {
        id: 'saas-sla-1',
        title: 'Service Level Agreement (SLA)',
        category: 'Performance',
        severity: 'high',
        type: 'regex',
        pattern: '(uptime|availability|service.?level|SLA)',
        explanation: 'Service levels and performance standards should be clearly defined.',
        suggestion: 'Include specific, measurable SLA requirements with remedies for non-compliance.',
        examples: ['99.9% uptime guarantee with service credits for downtime.'],
        enabled: true
      },
      {
        id: 'saas-data-security-1',
        title: 'Data Security Standards',
        category: 'Security',
        severity: 'critical',
        type: 'keyword',
        keywords: ['data security', 'encryption', 'SOC 2', 'ISO 27001', 'security measures'],
        explanation: 'The agreement must specify the data security standards the provider will adhere to.',
        suggestion: 'Reference specific security certifications (e.g., SOC 2 Type II) and describe technical and organizational measures.',
        examples: ['Provider will maintain SOC 2 Type II certification throughout the term.'],
        enabled: true
      },
      {
        id: 'saas-subscription-1',
        title: 'Subscription Term and Renewal',
        category: 'Commercial Terms',
        severity: 'medium',
        type: 'keyword',
        keywords: ['subscription term', 'initial term', 'renewal term', 'auto-renew'],
        explanation: 'The subscription term and auto-renewal clauses must be clear.',
        suggestion: 'Clearly state the initial term, renewal periods, and the process for non-renewal.',
        examples: ['This agreement will automatically renew for successive one-year periods.'],
        enabled: true
      }
    ]
  }
];