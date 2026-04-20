import { GridRule } from './grid.rule';
import { GridRuleResult } from './grid-rule.result';
import { GridState } from '../grid.state';
import { getColField } from './grid-col-utils';

export class RequiredFieldsRule<T extends { id: string | number }>
  implements GridRule<T> {

  name = 'required';

  validate(state: GridState<T>, row: T): GridRuleResult[] {
    const results: GridRuleResult[] = [];

    state.api.getColumnDefs()?.forEach(col => {
      const field = getColField<T>(col); // 🔥 TEK DOĞRU YOL
      if (!field) return;

      const rules: string[] = (col.context as any)?.rules ?? [];
      if (!rules.includes('required')) return;

      const value = (row as any)[field];

      if (value === null || value === undefined || value === '') {
        results.push({
          field,
          message: 'Zorunlu alan',
          severity: 'error'
        });
      }
    });

    return results;
  }
}
