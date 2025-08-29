import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ComplianceRule, ScanResult, SeverityLevel, RuleStatus } from '@/types/compliance';
import { SeverityBadge } from './SeverityBadge';
import { Check, X, AlertTriangle, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ChecklistPanelProps {
  rules: ComplianceRule[];
  scanResults?: ScanResult[];
  onFilterChange?: (filters: { severity: SeverityLevel[]; status: RuleStatus[] }) => void;
}

export function ChecklistPanel({ rules, scanResults = [], onFilterChange }: ChecklistPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<SeverityLevel[]>([]);
  const [statusFilter, setStatusFilter] = useState<RuleStatus[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Group rules by category
  const groupedRules = rules.reduce((acc, rule) => {
    if (!acc[rule.category]) {
      acc[rule.category] = [];
    }
    acc[rule.category].push(rule);
    return acc;
  }, {} as Record<string, ComplianceRule[]>);

  // Get scan result for a specific rule
  const getScanResult = (ruleId: string): ScanResult | undefined => {
    return scanResults.find(result => result.ruleId === ruleId);
  };

  // Get status icon
  const getStatusIcon = (status?: RuleStatus) => {
    switch (status) {
      case 'pass':
        return <Check className="w-4 h-4 text-severity-pass" />;
      case 'flag':
        return <AlertTriangle className="w-4 h-4 text-severity-medium" />;
      case 'fail':
        return <X className="w-4 h-4 text-severity-critical" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground/20" />;
    }
  };

  // Filter rules based on search and filters
  const filteredRules = (categoryRules: ComplianceRule[]) => {
    return categoryRules.filter(rule => {
      const matchesSearch = !searchQuery || 
        rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.explanation.toLowerCase().includes(searchQuery.toLowerCase());
      
      const result = getScanResult(rule.id);
      const matchesSeverity = severityFilter.length === 0 || severityFilter.includes(rule.severity);
      const matchesStatus = statusFilter.length === 0 || (result && statusFilter.includes(result.status));
      
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Calculate category stats
  const getCategoryStats = (categoryRules: ComplianceRule[]) => {
    const stats = { total: 0, pass: 0, flag: 0, fail: 0 };
    categoryRules.forEach(rule => {
      stats.total++;
      const result = getScanResult(rule.id);
      if (result) {
        stats[result.status]++;
      }
    });
    return stats;
  };

  return (
    <Card className="h-full p-4">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Compliance Checklist</h2>
          <Badge variant="outline" className="text-xs">
            {scanResults.length > 0 ? `${scanResults.length} scanned` : `${rules.length} rules`}
          </Badge>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select 
              value={severityFilter.join(',')} 
              onValueChange={(value) => {
                const newFilter = value ? value.split(',') as SeverityLevel[] : [];
                setSeverityFilter(newFilter);
                onFilterChange?.({ severity: newFilter, status: statusFilter });
              }}
            >
              <SelectTrigger className="flex-1">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <SelectValue placeholder="Severity" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={statusFilter.join(',')} 
              onValueChange={(value) => {
                const newFilter = value ? value.split(',') as RuleStatus[] : [];
                setStatusFilter(newFilter);
                onFilterChange?.({ severity: severityFilter, status: newFilter });
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pass">Pass</SelectItem>
                <SelectItem value="flag">Flag</SelectItem>
                <SelectItem value="fail">Fail</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rules List */}
        <div className="flex-1 overflow-auto space-y-2">
          {Object.entries(groupedRules).map(([category, categoryRules]) => {
            const filteredCategoryRules = filteredRules(categoryRules);
            const stats = getCategoryStats(filteredCategoryRules);
            const isExpanded = expandedCategories.has(category);

            if (filteredCategoryRules.length === 0) return null;

            return (
              <Collapsible key={category} open={isExpanded} onOpenChange={() => toggleCategory(category)}>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between p-2 h-auto hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{category}</span>
                      <Badge variant="outline" className="text-xs">
                        {stats.total}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      {stats.pass > 0 && <Badge className="text-xs bg-severity-pass-bg text-severity-pass">{stats.pass}</Badge>}
                      {stats.flag > 0 && <Badge className="text-xs bg-severity-medium-bg text-severity-medium">{stats.flag}</Badge>}
                      {stats.fail > 0 && <Badge className="text-xs bg-severity-critical-bg text-severity-critical">{stats.fail}</Badge>}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="pl-4 space-y-2">
                    {filteredCategoryRules.map((rule) => {
                      const result = getScanResult(rule.id);
                      return (
                        <div
                          key={rule.id}
                          className={cn(
                            "p-3 rounded-lg border transition-all duration-200",
                            result?.status === 'pass' && "border-severity-pass-border bg-severity-pass-bg/30",
                            result?.status === 'flag' && "border-severity-medium-border bg-severity-medium-bg/30",
                            result?.status === 'fail' && "border-severity-critical-border bg-severity-critical-bg/30",
                            !result && "border-border bg-card hover:bg-accent/30"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {getStatusIcon(result?.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-sm font-medium text-foreground truncate">
                                  {rule.title}
                                </h4>
                                <SeverityBadge severity={rule.severity} />
                              </div>
                              
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {rule.explanation}
                              </p>

                              {result && (
                                <div className="space-y-2">
                                  <p className="text-xs text-foreground">
                                    <strong>Analysis:</strong> {result.rationale}
                                  </p>
                                  
                                  {result.suggestions.length > 0 && (
                                    <div className="text-xs text-muted-foreground">
                                      <strong>Suggestions:</strong>
                                      <ul className="list-disc list-inside ml-2 mt-1">
                                        {result.suggestions.map((suggestion, index) => (
                                          <li key={index} className="line-clamp-1">{suggestion}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {result.matches.length > 0 && (
                                    <div className="text-xs text-muted-foreground">
                                      <strong>Matches:</strong> {result.matches.length} found
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>
    </Card>
  );
}