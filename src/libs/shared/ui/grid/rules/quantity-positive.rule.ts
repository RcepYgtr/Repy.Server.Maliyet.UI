import { GridRule } from './grid.rule';
import { GridRuleResult } from './grid-rule.result';
import { GridState } from '../grid.state';
import { getColField } from './grid-col-utils';

export class QuantityPositiveRule<T extends { id: string | number }>
  implements GridRule<T> {

  name = 'positive';

  validate(state: GridState<T>, row: T): GridRuleResult[] {
    const results: GridRuleResult[] = [];
    state.api.getColumnDefs()?.forEach(col => {
      const field = getColField<T>(col); // 🔥 TEK DOĞRU YOL
      if (!field) return;

      const rules: string[] = (col.context as any)?.rules ?? [];
      if (!rules.includes('positive')) return;

      const value = Number((row as any)[field]);

      if (value <= 0) {
        results.push({
          field,
          message: '0 dan büyük olmalı',
          severity: 'error'
        });
      }
    });

    return results;
  }
}
