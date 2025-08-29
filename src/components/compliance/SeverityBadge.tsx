import { Badge } from '@/components/ui/badge';
import { SeverityLevel, RuleStatus } from '@/types/compliance';
import { cn } from '@/lib/utils';

interface SeverityBadgeProps {
  severity?: SeverityLevel;
  status?: RuleStatus;
  className?: string;
}

const severityConfig = {
  critical: {
    label: 'Critical',
    className: 'bg-severity-critical-bg text-severity-critical border-severity-critical-border'
  },
  high: {
    label: 'High',
    className: 'bg-severity-high-bg text-severity-high border-severity-high-border'
  },
  medium: {
    label: 'Medium',
    className: 'bg-severity-medium-bg text-severity-medium border-severity-medium-border'
  },
  low: {
    label: 'Low',
    className: 'bg-severity-low-bg text-severity-low border-severity-low-border'
  }
};

const statusConfig = {
  pass: {
    label: 'Pass',
    className: 'bg-severity-pass-bg text-severity-pass border-severity-pass-border'
  },
  flag: {
    label: 'Flag',
    className: 'bg-severity-medium-bg text-severity-medium border-severity-medium-border'
  },
  fail: {
    label: 'Fail',
    className: 'bg-severity-critical-bg text-severity-critical border-severity-critical-border'
  }
};

export function SeverityBadge({ severity, status, className }: SeverityBadgeProps) {
  if (severity) {
    const config = severityConfig[severity];
    return (
      <Badge 
        variant="outline" 
        className={cn(config.className, 'font-medium text-xs', className)}
      >
        {config.label}
      </Badge>
    );
  }

  if (status) {
    const config = statusConfig[status];
    return (
      <Badge 
        variant="outline" 
        className={cn(config.className, 'font-medium text-xs', className)}
      >
        {config.label}
      </Badge>
    );
  }

  return null;
}