
import { TabService } from "../tabs/tab.service";
import { GridFeature } from "./grid.feature";
import { GridState } from "./grid.state";
import { GridRuleEngine } from "./rules/grid-rule.engine";

export class GridEngine<T extends { id: any }> {

  constructor(
    private gridKey: string,
    private tabService: TabService,
    private features?: GridFeature<T>[],
    private ruleEngine?: GridRuleEngine<T>

  ) { }

  bind(state: GridState<T>) {
    const safe = () =>
      !!state.api && !state.api.isDestroyed();

    // 🔥 İlk validation
    setTimeout(() => {
      if (!safe()) return;
      this.ruleEngine?.validateAll(state);
      state.api.refreshCells({ force: true });
    });
    state.api.addEventListener('cellValueChanged', e => {
      // 🔴 KESİN KORUMA
      if (!this.ruleEngine) {
        console.error('RuleEngine UNDEFINED');
        return;
      }
      state.markDirty(e.data.id);
      this.ruleEngine.validateRow(state, e.data);
      state.api.refreshCells({ force: true });

    });
    state.api.addEventListener('rowSelected', e => {
      if (!e.node?.isSelected()) return;
      state.selectedRowId.set(e.data.id);
    });

    // 🔹 ROW SELECT
    state.api.addEventListener('rowSelected', e => {
      if (!e.node?.isSelected()) return;
      const row = e.data as T;
      state.selectedRowId.set(row.id);
      this.tabService.updateGridState(this.gridKey, {
        selectedRowId: row.id
      });

    });

    state.api.addEventListener('rowDoubleClicked', e => {
      this.features.forEach(f =>
        f.onRowDoubleClick?.(state, e.data)
      );
    });


  }
  // 🔥 BUNU EKLE
  validateAll(state: GridState<T>) {
    state.rows().forEach(row => {
      this.validateRow(state, row);
    });
  }
  validateRow(state: GridState<T>, row: T) {
    return this.ruleEngine?.validateRow(state, row);
  }
  canSave(state: GridState<T>): boolean {
    return this.ruleEngine.canSave(state);
  }
}
