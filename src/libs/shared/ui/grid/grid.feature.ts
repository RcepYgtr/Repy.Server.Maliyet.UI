import { GridState } from './grid.state';

export interface GridFeature<T extends { id: string | number }> {
  onCellValueChanged?(ctx: GridState<T>, row: T): void;
  onRowDoubleClick?(ctx: GridState<T>, row: T): void;
  canSave?(ctx: GridState<T>, row: T): boolean;
}
