import { GridRuleResult } from './grid-rule.result';

export type RuleEvaluator = (value: any) => GridRuleResult | null;

export const GridRuleRegistry: Record<string, RuleEvaluator> = {

  required: (value) => value === null || value === undefined || value === '' ? { field: '', message: 'Zorunlu alan', severity: 'error' } : null,
  positive: (value) => Number(value) > 0 ? null : { field: '', message: '0 dan büyük olmalı', severity: 'error' },
  '<100': (value) => Number(value) < 100 ? null : { field: '', message: '100 den küçük olmalı', severity: 'warning' },
  attention: (value) => Number(value) < 0 ? null : { field: '', message: '', severity: 'info' },
  pending: (value) => value === 'PENDING' ? { field: '', message: 'İşlem beklemede', severity: 'info' } : null,
};
