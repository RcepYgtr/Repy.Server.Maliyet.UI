import { Injectable, computed } from '@angular/core';
import { GridState } from './grid.state';

@Injectable({ providedIn: 'root' })
export class GridSelectionFacade {

  private states = new Map<string, GridState<any>>();

  register(gridKey: string, state: GridState<any>) {
    this.states.set(gridKey, state);
  }

  selectedRow<T>(gridKey: string) {
    return computed<T | null>(() => {
      return this.states.get(gridKey)?.selectedRow() ?? null;
    });
  }
}
