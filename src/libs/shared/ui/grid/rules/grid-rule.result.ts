import { GridRuleSeverity } from './grid-rule-severity';

export interface GridRuleResult {
  field: string;
  message: string;
  severity: GridRuleSeverity;
}


