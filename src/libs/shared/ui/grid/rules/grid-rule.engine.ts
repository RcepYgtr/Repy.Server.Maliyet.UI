import { GridState } from '../grid.state';
import { getColField } from './grid-col-utils';
import { GridRuleRegistry } from './grid-rule-registry';
import { GridRuleResult } from './grid-rule.result';
import { GridRule } from './grid.rule';

export class GridRuleEngine<T extends { id: string | number }> {

  constructor(private rules: GridRule<T>[]) {}

  validateRow(state: GridState<T>, row: T): void {
     if (!state.api || state.api.isDestroyed()) return;
    const results: GridRuleResult[] = [];

    state.api.getColumnDefs()?.forEach(col => {
      const field = getColField<T>(col);   // 🔥 TEK DOĞRU YOL
      if (!field) return;

      const rules: string[] = (col.context as any)?.rules ?? [];
      if (!rules.length) return;

      const value = (row as any)[field];

      rules.forEach(ruleKey => {
        const evaluator = GridRuleRegistry[ruleKey];
        if (!evaluator) return;

        const result = evaluator(value);
        if (result) {
          results.push({
            ...result,
            field
          });
        }
      });
    });

    if (results.length === 0) {
      state.clearErrors(row.id);
    } else {
      state.setErrors(row.id, results);
    }
  }

  validateAll(state: GridState<T>) {
    state.rows().forEach(r => this.validateRow(state, r));
  }

  canSave(state: GridState<T>): boolean {
    this.validateAll(state);
    return !state.hasAnyError();
  }
}
