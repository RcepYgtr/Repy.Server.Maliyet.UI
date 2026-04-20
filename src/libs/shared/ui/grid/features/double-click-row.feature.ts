import { GridFeature } from '../grid.feature';
import { GridState } from '../grid.state';

export class DoubleClickRowFeature<T extends { id: string | number }>
  implements GridFeature<T> {

  constructor(
    private handler: (row: T, ctx: GridState<T>) => void
  ) {}

  onRowDoubleClick(ctx: GridState<T>, row: T) {
    ctx.selectedRowId.set(row.id);
    this.handler(row, ctx);
  }
}
