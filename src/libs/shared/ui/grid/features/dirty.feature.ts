import { GridFeature } from "../grid.feature";
import { GridState } from "../grid.state";

export class DirtyFeature<T extends { id: string | number }>  implements GridFeature<T> {

  onCellValueChanged(ctx: GridState<T>, row: T) {
    ctx.markDirty(row.id);
  }

  canSave(ctx: GridState<T>, row: T) {
    return ctx.isDirty(row.id);
  }
}
